import { Directive, Renderer2, ElementRef, Input, OnInit, Inject, OnDestroy } from '@angular/core';
import { Element, ParseTreeResult } from '@angular/compiler';
import { EventManager, EventType, VirtualFile, IdeFormatDocumentCommandData } from 'calpvin-ide-shared/IdeCommand';
import { DragDrop, DragRef } from '@angular/cdk/drag-drop';
import { VirtualFileTreeService } from '@latafi/core/src/lib/services/virtual-tree.service';
import { EventManagerService } from '@latafi/core/src/lib/services/event-manager.service';
import { findElement } from '@latafi/core/src/lib/extension/angular-html-elements.extension';
import { tryGetNode, setCssValue } from '@latafi/core/src/lib/extension/csstree-walker.extension';
import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { ComponentVisualEditorService } from '../services/component-visual-editor.service/component-visual-editor.service';
import { Subscription } from 'rxjs';
import { WorkspaceService } from '@latafi/core/src/lib/services/workspace.service';
import interact from 'interactjs';

@Directive({
  selector: '[latafiComponent]'
})
export class LatafiComponentDirective implements OnInit, OnDestroy {
  public static readonly ComponentCssClass = 'cide-component';
  public static readonly ComponentUniqueCssClass = 'cide-unique';

  private _interactable;
  private _uniqueClassName: string;

  constructor(
    @Inject(DragDrop) private dragDrop: DragDrop,
    private readonly _renderer: Renderer2,
    private hostElement: ElementRef<HTMLElement>,
    private virtualTree: VirtualFileTreeService,
    private readonly eventManagerService: EventManagerService,
    private readonly _componentVisualEditorService: ComponentVisualEditorService,
    private readonly _workspaceService: WorkspaceService) {

    _renderer.addClass(hostElement.nativeElement, LatafiComponentDirective.ComponentCssClass);

    hostElement.nativeElement.addEventListener('click', this.onClick);
  }

  ngOnInit(): void {
    this._uniqueClassName = LatafiComponentDirective.tryGetComponentUniqueClassName(this.hostElement.nativeElement);

    this.makeInteractable(this.hostElement.nativeElement);

    this.updateElementPosition();

    // Should always be parent
    //
    this._wrapperElement = this.hostElement.nativeElement.parentElement;

    this._onResetWrapperElementsPositionSubscription =
      this._componentVisualEditorService.onResetWrapperElementsPosition.subscribe(this.onResetWrapperElementsPosition);
  }

  private makeInteractable(el: HTMLElement) {
    this._interactable = interact(this.hostElement.nativeElement)
      .resizable({
        edges: { left: '.latafi-resizer-left', right: '.latafi-resizer-right', bottom: '.latafi-resizer-bottom', top: '.latafi-resizer-top' },
        modifiers: [
          interact.modifiers.restrictEdges({
            outer: 'parent'
          }),
          interact.modifiers.restrictSize({
            min: { width: 20, height: 20 }
          })
        ],
        inertia: true
      })
      .draggable({
        onmove: this.onMoveEnded,
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
          })
        ]
      })
      .on('resizemove', this.onResizeMoveEl);
  }

  private addElBorder() {
    const appendBorderFragment = (...cssStyle: string[]) => {
      const el = this._renderer.createElement('div') as HTMLElement;
      el.classList.add(...cssStyle);
      this._renderer.appendChild(this.hostElement.nativeElement, el);
    };

    appendBorderFragment('latafi-resizer', 'latafi-resizer-top');
    appendBorderFragment('latafi-resizer', 'latafi-resizer-right');
    appendBorderFragment('latafi-resizer', 'latafi-resizer-bottom');
    appendBorderFragment('latafi-resizer', 'latafi-resizer-left');

    this._renderer.addClass(this.hostElement.nativeElement, 'latafi-resizable');
  }

  private removeElBorder() {
    const borderFragments = this.hostElement.nativeElement.querySelectorAll('.latafi-resizer');
    borderFragments.forEach(fragment => fragment.remove());

    this._renderer.removeClass(this.hostElement, 'latafi-resizable');
  }

  private _wrapperElement: HTMLElement;

  private _onResetWrapperElementsPositionSubscription: Subscription;
  private onResetWrapperElementsPosition = (wrapperElement: HTMLElement) => {
    if (wrapperElement === this._wrapperElement) {
      this._lastLeftPosition = 0;
      this._lastTopPosition = 0;
    }
  }

  private updateElementPosition() {
    const elStyle = getComputedStyle(this.hostElement.nativeElement);

    if (elStyle.transform !== 'none') {
      const transformMatch = /matrix\([-\.0-9]+, [-\.0-9]+, [-\.0-9]+, [-\.0-9]+, ([-\.0-9]+), ([-\.0-9]+)\)/.exec(elStyle.transform);
      this._lastLeftPosition = Number.parseInt(transformMatch[1]);
      this._lastTopPosition = Number.parseInt(transformMatch[2]);
    }
  }

  private onResizeMoveEl = (event: { target: any; rect: { width: string | number; height: string | number; }; deltaRect: { left: number; top: number; }; }) => {
    // var target = event.target;

    this._componentVisualEditorService.setElementStyle(
      'width',
      event.rect.width + 'px',
      this.hostElement.nativeElement);

    this._componentVisualEditorService.setElementStyle(
      'height',
      event.rect.height + 'px',
      this.hostElement.nativeElement);

    // target.style.width = event.rect.width + 'px';
    // target.style.height = event.rect.height + 'px';

    this._lastLeftPosition += Math.round(event.deltaRect.left);
    this._lastTopPosition += Math.round(event.deltaRect.top);

    this._componentVisualEditorService.setElementStyle(
      'transform',
      `translate3d(${this._lastLeftPosition}px, ${this._lastTopPosition}px, 0px)`,
      this.hostElement.nativeElement);
    // target.textContent = Math.round(event.rect.width as number) + '\u00D7' + Math.round(event.rect.height as number);
  }


  private _lastLeftPosition = 0;
  private _lastTopPosition = 0;

  private onMoveEnded = async (event) => {

    var target = event.target as HTMLElement;

    this._lastLeftPosition += Math.round(event.dx);
    this._lastTopPosition += Math.round(event.dy);

    this._componentVisualEditorService.setElementStyle(
      'transform',
      `translate3d(${this._lastLeftPosition}px, ${this._lastTopPosition}px, 0px)`,
      this.hostElement.nativeElement, false, true);
  }

  private onClick = async (event: MouseEvent) => {
    event.stopPropagation();

    this.addElBorder();

    this._componentVisualEditorService.selectedElement = this.hostElement;

    if (event.altKey)
      this._componentVisualEditorService.addSelectElementToGroup(this.hostElement);

    if (event.ctrlKey) {
      const componentName = VirtualFileTreeService.getComponentName(this._workspaceService.activeComponent);
      const file = this.virtualTree.getFile(componentName, `${componentName}.component.html`);

      const parsedTreeResult = file.astTree as ParseTreeResult;

      const findResult = findElement(parsedTreeResult.rootNodes.map(x => x as Element), this._uniqueClassName);

      file.content = file.content.substr(0, findResult.findNode.startSourceSpan.start.offset)
        + file.content.substr(findResult.findNode.endSourceSpan.end.offset, file.content.length);

      const res = await this.eventManagerService.EventManager.sendEvent<VirtualFile>(
        {
          eventType: EventType.WriteComponentFile,
          uniqueIdentifier: EventManager.generateUniqueIdentifire(),
          data: file
        }, false);
    }
  }

  public static tryGetComponentUniqueClassName(el?: HTMLElement): string | undefined {
    let uniqueClassName: string;

    el.classList.forEach(element => {
      if (element.startsWith(LatafiComponentDirective.ComponentUniqueCssClass + '-')) { uniqueClassName = element; }
    });

    return uniqueClassName;
  }

  ngOnDestroy() {
    this._interactable.unset();
    this._onResetWrapperElementsPositionSubscription?.unsubscribe();
    this.hostElement.nativeElement.removeEventListener('click', this.onClick);
  }
}
