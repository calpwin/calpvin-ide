import { Injectable, Inject, RendererFactory2 } from '@angular/core';
import { DragDrop } from '@angular/cdk/drag-drop';
import { VirtualFileTreeService } from './virtual-tree.service';
import { EventManagerService } from './event-manager.service';
import { ComponentVisualEditorService } from '@latafi/component-visual-editor/src/public-api';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DevModuleManagerService {

  constructor(
    @Inject(DragDrop) private dragDrop: DragDrop,
    @Inject(DOCUMENT) private readonly _document: Document,
    private rendererFactory: RendererFactory2,
    private virtualTree: VirtualFileTreeService,
    private readonly eventManagerService: EventManagerService,
    private readonly _componentVisualEditorService: ComponentVisualEditorService) {
  }

  setComponentWrapperElement() {
    this._componentVisualEditorService.wrapperElement = this._document.querySelector('.cide-unique-component-container');
  }

  async updateVirtualTreeAsync() {
    await this.virtualTree.addComponentFiles('test-component');
  }
}
