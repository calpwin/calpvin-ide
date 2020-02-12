import { Directive, Renderer2, ElementRef, Input, OnInit, Inject, HostListener } from '@angular/core';
import { Element, ParseTreeResult } from '@angular/compiler';
import { findElement } from '../extension/angular-html-elements.extension';
import { EventManager, EventType, VirtualFile, IdeFormatDocumentCommandData } from 'calpvin-ide-shared/IdeCommand';
import { DragDrop, DragRef } from '@angular/cdk/drag-drop';
import { tryGetNode, setCssValue } from '../extension/csstree-walker.extension';
import * as csstree from 'css-tree';
import { CssNode, Rule } from 'css-tree';
import { VirtualFileTreeService } from '../services/virtual-tree.service';
import { EventManagerService } from '../services/event-manager.service';
import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { ComponentVisualEditorService } from '@latafi/component-visual-editor/src/public-api';

@Directive({
  selector: '[cideComponent]'
})
export class CideComponentDirective implements OnInit {
  public static readonly ComponentCssClass = 'cide-component';
  public static readonly ComponentUniqueCssClass = 'cide-unique';

  private _dargRef: DragRef;
  private _uniqueClassName: string;

  constructor(
    @Inject(DragDrop) private dragDrop: DragDrop,
    private renderer: Renderer2,
    private hostElement: ElementRef<HTMLElement>,
    private virtualTree: VirtualFileTreeService,
    private readonly eventManagerService: EventManagerService,
    private readonly _componentVisualEditorService: ComponentVisualEditorService) {

    renderer.addClass(hostElement.nativeElement, CideComponentDirective.ComponentCssClass);

    hostElement.nativeElement.addEventListener('click', this.onClick);
  }

  @Input() baseComponentTagName: string;

  ngOnInit(): void {
    if (!this.baseComponentTagName) {
      console.log('Base Component name not set!');
    }

    this._uniqueClassName = this.tryGetComponentUniqueClassName();

    this._dargRef = this.dragDrop.createDrag(this.hostElement.nativeElement);

    this._dargRef.ended.subscribe(this.onMoveEnded);
  }

  private onMoveEnded = async (event: { source: DragRef<any>, distance: Point }) => {
    const componentName = VirtualFileTreeService.getComponentName(this.baseComponentTagName);
    const file = this.virtualTree.getFile(componentName, `${componentName}.component.scss`);

    const elStyle = getComputedStyle(this.hostElement.nativeElement);

    const node = tryGetNode(file.astTree as CssNode, this._uniqueClassName);
    setCssValue(node as Rule, 'position', 'absolute');
    setCssValue(node as Rule, 'left', Number.parseInt(elStyle.left, 0) + event.distance.x + 'px');
    setCssValue(node as Rule, 'top', Number.parseInt(elStyle.top, 0) + event.distance.y + 'px');

    file.content = csstree.generate(file.astTree);

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

  private onClick = async (event: MouseEvent) => {
    this._componentVisualEditorService.selectedElement = this.hostElement;

    if (event.ctrlKey) {
      const componentName = VirtualFileTreeService.getComponentName(this.baseComponentTagName);
      const file = this.virtualTree.getFile(componentName, `${componentName}.component.html`);

      const parsedTreeResult = file.astTree as ParseTreeResult;

      const findNode = findElement(parsedTreeResult.rootNodes.map(x => x as Element), this._uniqueClassName);

      file.content = file.content.substr(0, findNode.startSourceSpan.start.offset)
        + file.content.substr(findNode.endSourceSpan.end.offset, file.content.length);

      const res = await this.eventManagerService.EventManager.sendEvent<VirtualFile>(
        {
          eventType: EventType.WriteComponentFile,
          uniqueIdentifier: EventManager.generateUniqueIdentifire(),
          data: file
        }, false);
    }
  }

  private tryGetComponentUniqueClassName(el?: HTMLElement): string | undefined {
    let uniqueClassName: string;

    (el || this.hostElement.nativeElement).classList.forEach(element => {
      if (element.startsWith(CideComponentDirective.ComponentUniqueCssClass + '-')) { uniqueClassName = element; }
    });

    return uniqueClassName;
  }
}
