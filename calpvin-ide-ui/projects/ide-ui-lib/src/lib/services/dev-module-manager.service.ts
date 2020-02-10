import { Injectable, Inject, ElementRef, RendererFactory2 } from "@angular/core";
import { CideComponentDirective } from '../directive/cide-component.directive';
import { DragDrop } from '@angular/cdk/drag-drop';
import { VirtualFileTreeService } from './virtual-tree.service';
import { EventManagerService } from './event-manager.service';

@Injectable({
  providedIn: 'root'
})
export class DevModuleManagerService {

  constructor(
    @Inject(DragDrop) private dragDrop: DragDrop,
    private rendererFactory: RendererFactory2,
    private virtualTree: VirtualFileTreeService,
    private readonly eventManagerService: EventManagerService) {

  }

  async updateVirtualTreeAsync() {
    await this.virtualTree.addComponentFiles('test-component');
  }

   applyCideComponentDirective() {
    const componentEls = document.getElementsByClassName('cide-component');


    for (let index = 0; index < componentEls.length; index++) {
      const compEl = componentEls[index];

      const directive = new CideComponentDirective(
        this.dragDrop,
        this.rendererFactory.createRenderer(null, null),
        new ElementRef(compEl as HTMLElement),
        this.virtualTree,
        this.eventManagerService);

      directive.baseComponentTagName = compEl.getAttribute('cide-belongs-to-component');

      directive.ngOnInit();
    }
  }
}
