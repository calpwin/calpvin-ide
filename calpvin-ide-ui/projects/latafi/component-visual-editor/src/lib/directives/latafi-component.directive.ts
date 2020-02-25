import { Directive, Renderer2, ElementRef, Input, OnInit, Inject, OnDestroy } from '@angular/core';
import { Element, ParseTreeResult } from '@angular/compiler';
import { EventManager, EventType, VirtualFile, IdeFormatDocumentCommandData } from 'calpvin-ide-shared/IdeCommand';
import { DragDrop, DragRef } from '@angular/cdk/drag-drop';
import * as csstree from 'css-tree';
import { CssNode, Rule } from 'css-tree';
import { VirtualFileTreeService } from '@latafi/core/src/lib/services/virtual-tree.service';
import { EventManagerService } from '@latafi/core/src/lib/services/event-manager.service';
import { findElement } from '@latafi/core/src/lib/extension/angular-html-elements.extension';
import { tryGetNode, setCssValue } from '@latafi/core/src/lib/extension/csstree-walker.extension';
import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { ComponentVisualEditorService } from '../component-visual-editor.service';
import { Subscription } from 'rxjs';
import { WorkspaceService } from '@latafi/core/src/lib/services/workspace.service';
import interact from 'interactjs';

@Directive({
  selector: '[latafiComponent]'
})
export class LatafiComponentDirective implements OnInit, OnDestroy {
  public static readonly ComponentCssClass = 'cide-component';
  public static readonly ComponentUniqueCssClass = 'cide-unique';

  private _dargRef: DragRef;
  private _interactable;
  private _uniqueClassName: string;

  constructor(
    @Inject(DragDrop) private dragDrop: DragDrop,
    private renderer: Renderer2,
    private hostElement: ElementRef<HTMLElement>,
    private virtualTree: VirtualFileTreeService,
    private readonly eventManagerService: EventManagerService,
    private readonly _componentVisualEditorService: ComponentVisualEditorService,
    private readonly _workspaceService: WorkspaceService) {

    renderer.addClass(hostElement.nativeElement, LatafiComponentDirective.ComponentCssClass);

    hostElement.nativeElement.addEventListener('click', this.onClick);
  }

  ngOnInit(): void {
    this._uniqueClassName = LatafiComponentDirective.tryGetComponentUniqueClassName(this.hostElement.nativeElement);

    // this._dargRef = this.dragDrop.createDrag(this.hostElement.nativeElement);
    // this._dargRef.ended.subscribe(this.onMoveEnded);


    this._interactable = interact(this.hostElement.nativeElement)
      .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },

        modifiers: [
          // keep the edges inside the parent
          interact.modifiers.restrictEdges({
            outer: 'parent'
          }),

          // minimum size
          interact.modifiers.restrictSize({
            min: { width: 100, height: 50 }
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
      .on('resizemove', (event) => {
        var target = event.target;
        // var x = (parseFloat(target.getAttribute('data-x')) || 0);
        // var y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style
        target.style.width = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

        // translate when resizing from top or left edges
        this._lastLeftPosition += event.deltaRect.left;
        this._lastTopPosition += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
          'translate(' + this._lastLeftPosition + 'px,' + this._lastTopPosition + 'px)';

        // target.setAttribute('data-x', x);
        // target.setAttribute('data-y', y);
        target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
      });


    this.updateElementPosition();

    this._wrapperElement = this.hostElement.nativeElement.parentElement;

    this._onResetWrapperElementsPositionSubscription =
      this._componentVisualEditorService.onResetWrapperElementsPosition.subscribe(this.onResetWrapperElementsPosition);
  }

  private _wrapperElement: HTMLElement;

  private _onResetWrapperElementsPositionSubscription: Subscription;
  private onResetWrapperElementsPosition = (wrapperElement: HTMLElement) => {
    if (wrapperElement === this._wrapperElement) {
      this._lastLeftPosition = 0;
      this._lastTopPosition = 0;
      // this._dargRef.setFreeDragPosition({ x: 0, y: 0 });
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

  private _lastLeftPosition = 0;
  private _lastTopPosition = 0;

  // private onMoveEnded = async (event: { source: DragRef<any>, distance: Point }) => {
  private onMoveEnded = async (event) => {

    // if (!this._lastLeftPosition || !this._lastTopPosition) {
    //   const elStyle = getComputedStyle(this.hostElement.nativeElement);
    //   const transformMatch = /matrix\([-0-9]+, [-0-9]+, [-0-9]+, [-0-9]+, ([-0-9]+), ([-0-9]+)\)/.exec(elStyle.transform);
    //   this._lastLeftPosition = Number.parseInt(transformMatch[1]);
    //   this._lastTopPosition = Number.parseInt(transformMatch[2]);
    // }

    // const elStyle = getComputedStyle(this.hostElement.nativeElement);

    // const newLeftPosition = (this._lastLeftPosition || Number.parseInt(elStyle.left, 0)) + event.distance.x;
    // const newTopPosition = (this._lastTopPosition || Number.parseInt(elStyle.top, 0)) + event.distance.y;

    var target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    // var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    // var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    this._lastLeftPosition += event.dx;
    this._lastTopPosition += event.dy;

    this._componentVisualEditorService.setElementStyle(
      'transform',
      `translate3d(${this._lastLeftPosition}px, ${this._lastTopPosition}px, 0px)`,
      this.hostElement.nativeElement, false, true);

    //update the posiion attributes
    // target.setAttribute('data-x', this._lastLeftPosition);
    // target.setAttribute('data-y', this._lastTopPosition);

    // this._componentVisualEditorService.setElementStyle(
    //   'left',
    //   newLeftPosition + 'px',
    //   this.hostElement.nativeElement, false, false);

    // this._componentVisualEditorService.setElementStyle(
    //   'top',
    //   newTopPosition + 'px',
    //   this.hostElement.nativeElement, false, false);

    // this._lastLeftPosition = newLeftPosition;
    // this._lastTopPosition = newTopPosition;
  }

  private onClick = async (event: MouseEvent) => {
    event.stopPropagation();

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
    this._onResetWrapperElementsPositionSubscription?.unsubscribe();
    this._interactable.unset();
    // this._dargRef.dispose();
    this.hostElement.nativeElement.removeEventListener('click', this.onClick);
  }
}
