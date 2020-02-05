import { Directive, Renderer2, ElementRef, Input, OnInit, Inject } from '@angular/core';
import { Element, ParseTreeResult } from '@angular/compiler';
import { VirtualFileTree } from 'src/app.lib/virtual-tree/virtual-tree';
import { findElement } from 'src/app.lib/extension/angular-html-elements.extension';
import { VirtualFileType, EventManager, EventType, VirtualFile } from 'calpvin-ide-shared/IdeCommand';
import { AppComponent } from '../app.component';
import { DragDrop, DragRef } from '@angular/cdk/drag-drop';
import { CssNode, Rule } from 'css-tree';
import { tryGetNode, setCssValue } from 'src/app.lib/extension/csstree-walker.extension';
import { Point } from '@angular/cdk/drag-drop/typings/drag-ref';
import * as csstree from 'css-tree';

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
    private virtualTree: VirtualFileTree) {

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
    const componentName = VirtualFileTree.getComponentName(this.baseComponentTagName);
    const file = this.virtualTree.getFile(componentName, `${componentName}.component.scss`);

    const node = tryGetNode(file.astTree as CssNode, this._uniqueClassName);
    setCssValue(node as Rule, 'position', 'absolute');
    setCssValue(node as Rule, 'left', event.distance.x.toString() + 'px');
    setCssValue(node as Rule, 'top', event.distance.y.toString() + 'px');

    file.content = csstree.generate(file.astTree);

    const res = await AppComponent.EventManager.sendEvent<VirtualFile>(
      {
        eventType: EventType.WriteComponentFile,
        uniqueIdentifier: EventManager.generateUniqueIdentifire(),
        data: file
      }, false);
  }

  private onClick = async (event: MouseEvent) => {
    if (event.ctrlKey) {
      const componentName = VirtualFileTree.getComponentName(this.baseComponentTagName);
      const file = this.virtualTree.getFile(componentName, `${componentName}.component.html`);

      const parsedTreeResult = file.astTree as ParseTreeResult;

      const findNode = findElement(parsedTreeResult.rootNodes.map(x => x as Element), this._uniqueClassName);

      file.content = file.content.substr(0, findNode.startSourceSpan.start.offset)
        + file.content.substr(findNode.endSourceSpan.end.offset, file.content.length);

      const res = await AppComponent.EventManager.sendEvent<VirtualFile>(
        {
          eventType: EventType.WriteComponentFile,
          uniqueIdentifier: EventManager.generateUniqueIdentifire(),
          data: new VirtualFile(VirtualFileType.ComponentHtml, componentName, file.content)
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
