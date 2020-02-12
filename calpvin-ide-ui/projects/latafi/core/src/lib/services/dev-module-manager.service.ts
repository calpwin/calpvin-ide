import { Injectable, Inject, RendererFactory2 } from '@angular/core';
import { DragDrop } from '@angular/cdk/drag-drop';
import { VirtualFileTreeService } from './virtual-tree.service';
import { EventManagerService } from './event-manager.service';
import { ComponentVisualEditorService } from '@latafi/component-visual-editor/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class DevModuleManagerService {

  constructor(
    @Inject(DragDrop) private dragDrop: DragDrop,
    private rendererFactory: RendererFactory2,
    private virtualTree: VirtualFileTreeService,
    private readonly eventManagerService: EventManagerService,
    private readonly _componentVisualEditorService: ComponentVisualEditorService) {

  }

  async updateVirtualTreeAsync() {
    await this.virtualTree.addComponentFiles('test-component');
  }
}
