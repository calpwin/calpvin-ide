import { Injectable, ElementRef, EventEmitter, Inject, RendererFactory2, ViewContainerRef } from '@angular/core';
import { LatafiComponentDirective } from './directives/latafi-component.directive';
import { DragDrop } from '@angular/cdk/drag-drop';
import { VirtualFileTreeService } from '@latafi/core/src/lib/services/virtual-tree.service';
import { EventManagerService } from '@latafi/core/src/lib/services/event-manager.service';
import { ILatafiExtension } from '@latafi/core/src/lib/services/i-extenson.service';
import { VirtualFile, EventType, EventManager, IdeFormatDocumentCommandData } from 'calpvin-ide-shared';
import { WorkspaceService } from '@latafi/core/src/lib/services/workspace.service';
import { tryGetNode, setCssValue, removeCssProperty } from '@latafi/core/src/lib/extension/csstree-walker.extension';
import { CssNode, Rule } from 'css-tree';
import * as csstree from 'css-tree';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentVisualEditorService extends ILatafiExtension {

  private readonly _renderer;

  constructor(
    @Inject(DragDrop) private dragDrop: DragDrop,
    private readonly rendererFactory: RendererFactory2,
    private readonly virtualTreeService: VirtualFileTreeService,
    private readonly eventManagerService: EventManagerService,
    private readonly _workspaceService: WorkspaceService) {
    super();

    this._renderer = rendererFactory.createRenderer(null, null);
  }

  onAppInit() {
  }

  onBaseAppConstruct() {
  }

  readonly onResetWrapperElementsPosition = new EventEmitter<HTMLElement>();

  async resetWrapperElementsPosition() {
    for (let index = 0; index < this._wrapperElement.children.length; index++) {
      const element = this._wrapperElement.children[index];

      await this.setElementStyle('transform', null, element as HTMLElement);
    }

    this.onResetWrapperElementsPosition.emit(this._wrapperElement);
  }


  private _wrapperElement: HTMLElement;
  public get wrapperElement(): HTMLElement {
    return this._wrapperElement;
  }
  public set wrapperElement(v: HTMLElement) {
    this._wrapperElement = v;
  }

  private _previousSelectedElement: ElementRef<HTMLElement>;
  public get previousSelectedElement(): ElementRef<HTMLElement> {
    return this._previousSelectedElement;
  }

  private _selectedElementUniqueClassName: string = undefined;

  private _selectedElement: ElementRef | undefined;
  public get selectedElement(): ElementRef | undefined {
    return this._selectedElement;
  }
  public set selectedElement(v: ElementRef | undefined) {
    this._previousSelectedElement = this._selectedElement;
    this._selectedElement = v;

    if (v)
      this._selectedElementUniqueClassName = LatafiComponentDirective.tryGetComponentUniqueClassName(v.nativeElement);

    this.onSelectElement.emit(v);
  }

  onSelectElement = new EventEmitter<ElementRef | undefined>();

  onPropertyEditorWrapperInit = new EventEmitter<ViewContainerRef>();

  private _directives: LatafiComponentDirective[] = []

  applyLatafiComponentDirective() {
    const componentEls = document.getElementsByClassName('cide-component');

    this._directives.forEach(directive => directive.ngOnDestroy());
    this._directives = [];

    for (let index = 0; index < componentEls.length; index++) {
      const compEl = componentEls[index];

      const elStyle = getComputedStyle(compEl);

      if (elStyle.transform !== 'none') {
        const transformMatch = /matrix\([-0-9]+, [-0-9]+, [-0-9]+, [-0-9]+, ([-0-9]+), ([-0-9]+)\)/.exec(elStyle.transform);
        this._renderer.setStyle(compEl, 'transform', `translate3d(${transformMatch[1]}px, ${transformMatch[2]}px, 0px)`);
      }

      const directive = new LatafiComponentDirective(
        this.dragDrop,
        this.rendererFactory.createRenderer(null, null),
        new ElementRef(compEl as HTMLElement),
        this.virtualTreeService,
        this.eventManagerService,
        this);

      directive.baseComponentTagName = compEl.getAttribute('cide-belongs-to-component');

      directive.ngOnInit();

      this._directives.push(directive);
    }
  }

  async setElementStyle(style: string, value?: string, element?: HTMLElement, hardSave = false, softSave = true, file?: VirtualFile) {
    const selectedElementUniqueClassName = !element
      ? this._selectedElementUniqueClassName
      : LatafiComponentDirective.tryGetComponentUniqueClassName(element);

    element = element || this.selectedElement?.nativeElement;
    if (!element) throwError('Can not find element for styling');
    if (!this._workspaceService.activeComponent) throwError('ActiveComponent not set');

    if (!selectedElementUniqueClassName) throwError('Can not get Unique element css class. Must start with unique');

    if (!file) {
      file = this.virtualTreeService.getFile(this._workspaceService.activeComponent, `${this._workspaceService.activeComponent}.component.scss`);
    }

    const node = tryGetNode(file.astTree as CssNode, selectedElementUniqueClassName);

    if (value)
      setCssValue(node as Rule, style, value);
    else
      removeCssProperty(node as Rule, style);

    file.content = csstree.generate(file.astTree);

    if (softSave)
      this._renderer.setStyle(element, style, this.ensureSoftStyleValue(style, value));

    if (hardSave) {
      await this.eventManagerService.EventManager.sendEvent<VirtualFile>(
        {
          eventType: EventType.WriteComponentFile,
          uniqueIdentifier: EventManager.generateUniqueIdentifire(),
          data: file
        }, false);

      await this.eventManagerService.EventManager.sendEvent<IdeFormatDocumentCommandData>(
        {
          eventType: EventType.IdeFormatDocument,
          uniqueIdentifier: EventManager.generateUniqueIdentifire(),
          data: { uri: file.fileName }
        }, false);
    }
  }

  private ensureSoftStyleValue(style: string, value: string): string {
    if (style === 'transform' && !value) return 'translate3d(0px, 0px, 0px)';

    return value;
  }
}
