import { Injectable, Inject, RendererFactory2 } from '@angular/core';
import { DragDrop } from '@angular/cdk/drag-drop';
import { VirtualFileTreeService } from './virtual-tree.service';
import { EventManagerService } from './event-manager.service';
import { ComponentVisualEditorService, addWrapperComponentAction } from '@latafi/component-visual-editor/src/public-api';
import { DOCUMENT } from '@angular/common';
import {
  LatafiComponent,
  LatafiComponentDisplayMode
} from '@latafi/component-visual-editor/src/lib/services/component-visual-editor.service/reducer/latafi-component';
import { LatafiComponentDirective } from '@latafi/component-visual-editor/src/lib/directives/latafi-component.directive';
import { Store } from '@ngrx/store';

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
    private readonly _componentVisualEditorService: ComponentVisualEditorService,
    private readonly _store: Store<any>) {
  }

  setComponentWrapperElement() {
    const wrapperEl = this._document.querySelector(`.${ComponentVisualEditorService.COMPONENT_CONTAINER_CLASS}`) as HTMLElement;

    if (wrapperEl) {
      const newComp = new LatafiComponent(LatafiComponentDirective.tryGetComponentUniqueClassName(wrapperEl), wrapperEl);
      newComp.wrapperDisplayMode = LatafiComponentDisplayMode.Relative;

      this._store.dispatch(addWrapperComponentAction({ wrapperComp: newComp }));
    }
  }

  async updateVirtualTreeAsync() {
    await this.virtualTree.addComponentFiles('test-component');
  }
}
