import { Injectable, ElementRef, EventEmitter, Inject, RendererFactory2, ViewContainerRef, ComponentRef, Renderer2 } from '@angular/core';
import { LatafiComponentDirective } from '../../directives/latafi-component.directive';
import { DragDrop } from '@angular/cdk/drag-drop';
import { VirtualFileTreeService } from '@latafi/core/src/lib/services/virtual-tree.service';
import { EventManagerService } from '@latafi/core/src/lib/services/event-manager.service';
import { LatafiInjectableService } from '@latafi/core/src/lib/services/injectable.service';
import { VirtualFile, EventType, EventManager, IdeFormatDocumentCommandData } from 'calpvin-ide-shared';
import { WorkspaceService } from '@latafi/core/src/lib/services/workspace.service';
import { tryGetNode, setCssValue, removeCssProperty } from '@latafi/core/src/lib/extension/csstree-walker.extension';
import { CssNode, Rule } from 'css-tree';
import * as csstree from 'css-tree';
import { throwError } from 'rxjs';
import { ComponentVisualEditorComponent } from '../../component-visual-editor.component';
import { VisualComponentEditorState, lastSelectedComponentSelector, wrapperComponentSelector, setSelectedComponentAction, selectedComponentsSelector } from './reducer/latafi-component-list.reducer';
import { Store, createSelector, createFeatureSelector, select } from '@ngrx/store';
import { LatafiComponent, LatafiComponentDisplayMode } from './reducer/latafi-component';

@Injectable({
  providedIn: 'root',
})
export class ComponentVisualEditorService extends LatafiInjectableService {

  public static readonly COMPONENT_CONTAINER_CLASS = 'cide-component-container';

  public static readonly COMPONENT_CLASS = 'cide-component';

  constructor(
    @Inject(DragDrop) private dragDrop: DragDrop,
    private readonly rendererFactory: RendererFactory2,
    private readonly virtualTreeService: VirtualFileTreeService,
    private readonly eventManagerService: EventManagerService,
    private readonly _workspaceService: WorkspaceService,
    private readonly _store: Store<any>) {
    super();
    this._renderer = rendererFactory.createRenderer(null, null);
  }

  public get isDeselectPreviouseEl(): boolean {
    return this._isDeselectPreviouseEl;
  }
  public set isDeselectPreviouseEl(v: boolean) {
    this._isDeselectPreviouseEl = v;
  }

  private _wrapperComp?: LatafiComponent = undefined;
  private _selectedComp?: LatafiComponent = undefined;

  //#region Events

  readonly onPropertyEditorWrapperInit = new EventEmitter<ViewContainerRef>();

  readonly onResetWrapperElementsPosition = new EventEmitter<HTMLElement>();

  // readonly onAddSelectElementToGroup = new EventEmitter<ElementRef>();

  // readonly onRemoveSelectElementFromGroup = new EventEmitter<ElementRef>();

  //#endregion

  private readonly _renderer: Renderer2;

  canvaEditorComponent: ComponentVisualEditorComponent;

  private _isDeselectPreviouseEl = true;

  private _directives: LatafiComponentDirective[] = []

  static isComponentContainer(element: HTMLElement) {
    return element.classList.contains(this.COMPONENT_CONTAINER_CLASS);
  }

  onAppInit() {
    const selector = createSelector(
      createFeatureSelector('visualComponentEditorFeature'),
      (state: VisualComponentEditorState) => state.innerComponents);

    this._store.select(wrapperComponentSelector).subscribe(c => this._wrapperComp = c);
    this._store.select(lastSelectedComponentSelector).subscribe(c => this._selectedComp = c);
    this._store.select(selector).subscribe(this.onInnerComponentsUpdated);
  }

  onBaseAppConstruct() {
  }

  private onInnerComponentsUpdated = (components: LatafiComponent[]) => {
    if (components?.length > 0) { this.updateLatafiComponentsDirective(components); }
  }

  updateLatafiComponentsDirective(components: LatafiComponent[]) {
    this._directives.forEach(directive => directive.ngOnDestroy());
    this._directives = [];

    components.forEach(comp => {
      const directive = new LatafiComponentDirective(
        this.dragDrop,
        this.rendererFactory.createRenderer(null, null),
        new ElementRef(comp.baseEl),
        this.virtualTreeService,
        this.eventManagerService,
        this,
        this._workspaceService,
        this._store);

      directive.ngOnInit();

      this._directives.push(directive);
    });
  }

  async resetWrapperElementsPosition() {
    for (let index = 0; index < this._wrapperComp.baseEl.children.length; index++) {
      const element = this._wrapperComp.baseEl.children[index];

      await this.setElementStyle('transform', null, element as HTMLElement);
    }

    this.onResetWrapperElementsPosition.emit(this._wrapperComp.baseEl);
  }

  public rebuildWrapperComponents(wrapperEl: HTMLElement): LatafiComponent[] {
    const componentEls: HTMLElement[] = [];
    const components: LatafiComponent[] = [];

    for (let i = 0; i < wrapperEl.children.length; i++) {
      const element = wrapperEl.children[i];

      if (element.classList.contains(ComponentVisualEditorService.COMPONENT_CLASS))
        componentEls.push(element as HTMLElement);
    }

    for (let index = 0; index < componentEls.length; index++) {
      const compEl = componentEls[index];

      const elStyle = getComputedStyle(compEl);

      if (elStyle.transform !== 'none') {
        const transformMatch = /matrix\([-\.0-9]+, [-\.0-9]+, [-\.0-9]+, [-\.0-9]+, ([-\.0-9]+), ([-\.0-9]+)\)/.exec(elStyle.transform);
        this._renderer.setStyle(compEl, 'transform', `translate3d(${transformMatch[1]}px, ${transformMatch[2]}px, 0px)`);
      }

      components.push({
        baseEl: compEl,
        uniqueClassName: LatafiComponentDirective.tryGetComponentUniqueClassName(compEl),
        isWrapperEl: false,
        wrapperDisplayMode: LatafiComponentDisplayMode.Relative,
        isSelected: false
      });
    }

    return components;
  }

  async setElementStyle(style: string, value?: string, element?: HTMLElement, hardSave = false, softSave = true, file?: VirtualFile) {

    const selectedElementUniqueClassName = !element
      ? this._selectedComp?.uniqueClassName
      : LatafiComponentDirective.tryGetComponentUniqueClassName(element);

    element = element || this._selectedComp.baseEl;
    if (!element) { throwError('Can not find element for styling'); }
    if (!this._workspaceService.activeComponent) { throwError('ActiveComponent not set'); }

    if (!selectedElementUniqueClassName) { throwError('Can not get Unique element css class. Must start with unique'); }

    if (!file) {
      // tslint:disable-next-line: max-line-length
      file = this.virtualTreeService.getFile(this._workspaceService.activeComponent, `${this._workspaceService.activeComponent}.component.scss`);
    }

    const node = tryGetNode(file.astTree as CssNode, selectedElementUniqueClassName);

    if (value)
      setCssValue(node as Rule, style, value);
    else
      removeCssProperty(node as Rule, style);

    file.content = csstree.generate(file.astTree);

    if (softSave)
      this.setSoftStyleValue(element, style, value);

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

  private setSoftStyleValue(el: HTMLElement, style: string, value: string) {
    if (style === 'transform' && !value) {
      this._renderer.removeStyle(el, 'transform');
      this._renderer.setStyle(el, 'transform', 'translate3d(0,0,0)');
    }
    else
      this._renderer.setStyle(el, style, value);
  }
}
