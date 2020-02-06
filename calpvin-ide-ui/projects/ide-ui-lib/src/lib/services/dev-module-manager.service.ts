import { Injectable, NgModuleRef, ApplicationRef, Inject, Renderer2, ElementRef, RendererFactory2 } from "@angular/core";
import { CideComponentDirective } from '../directive/cide-component.directive';
import { DragDrop } from '@angular/cdk/drag-drop';
import { VirtualFileTreeService } from './virtual-tree';
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

  onModuleBoostraped(moduleRef: NgModuleRef<any>) {
    // const appRef: ApplicationRef = module.injector.get(ApplicationRef);
    // const elements = appRef.components[0].location. .map(c => c.location);

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
