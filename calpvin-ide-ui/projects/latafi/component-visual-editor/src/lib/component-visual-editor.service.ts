import { Injectable, ElementRef, EventEmitter, Inject, RendererFactory2, ViewContainerRef } from '@angular/core';
import { LatafiComponentDirective } from './directives/latafi-component.directive';
import { DragDrop } from '@angular/cdk/drag-drop';
import { VirtualFileTreeService } from '@latafi/core/src/lib/services/virtual-tree.service';
import { EventManagerService } from '@latafi/core/src/lib/services/event-manager.service';
import { ILatafiExtension } from '@latafi/core/src/lib/services/i-extenson.service';

@Injectable({
  providedIn: 'root'
})
export class ComponentVisualEditorService extends ILatafiExtension {
  constructor(
    @Inject(DragDrop) private dragDrop: DragDrop,
    private rendererFactory: RendererFactory2,
    private virtualTree: VirtualFileTreeService,
    private readonly eventManagerService: EventManagerService) {
    super();
  }

  onAppInit() {
  }

  onBaseAppConstruct() {
  }

  private _selectedElement: ElementRef | undefined;
  public get selectedElement(): ElementRef | undefined {
    return this._selectedElement;
  }
  public set selectedElement(v: ElementRef | undefined) {
    this._selectedElement = v;
  }

  onPropertyEditorWrapperInit = new EventEmitter<ViewContainerRef>();

  applyLatafiComponentDirective() {
    const componentEls = document.getElementsByClassName('cide-component');


    for (let index = 0; index < componentEls.length; index++) {
      const compEl = componentEls[index];

      const directive = new LatafiComponentDirective(
        this.dragDrop,
        this.rendererFactory.createRenderer(null, null),
        new ElementRef(compEl as HTMLElement),
        this.virtualTree,
        this.eventManagerService,
        this);

      directive.baseComponentTagName = compEl.getAttribute('cide-belongs-to-component');

      directive.ngOnInit();
    }
  }
}
