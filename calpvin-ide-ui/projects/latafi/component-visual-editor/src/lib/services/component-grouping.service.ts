import { Injectable, ElementRef, RendererFactory2 } from '@angular/core';
import { ComponentVisualEditorService } from '../services/component-visual-editor.service/component-visual-editor.service';
import { LatafiInjectableService } from '@latafi/core/src/lib/services/injectable.service';
import { VirtualFileTreeService } from '@latafi/core/src/lib/services/virtual-tree.service';
import { WorkspaceService } from '@latafi/core/src/lib/services/workspace.service';
import { ParseTreeResult, Element } from '@angular/compiler';
import { findElement } from '@latafi/core/src/lib/extension/angular-html-elements.extension';
import { LatafiComponentDirective } from '../directives/latafi-component.directive';
import { EventManagerService } from '@latafi/core/src/lib/services/event-manager.service';
import { VirtualFile, EventType, EventManager } from 'calpvin-ide-shared';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class ComponentGroupingService extends LatafiInjectableService {

  constructor(
    private readonly _componentVisualEditorService: ComponentVisualEditorService,
    private readonly _virtualFileTreeService: VirtualFileTreeService,
    private readonly _workspaceService: WorkspaceService,
    private readonly _eventManagerService: EventManagerService,
    _rendererFactory: RendererFactory2) {
    super();

    const rendrer = _rendererFactory.createRenderer(null, null);
    rendrer.listen('document', 'keydown', event => { this.onDocumentKeydown(event); });
  }

  onBaseAppConstruct() {
    this._componentVisualEditorService.onAddSelectElementToGroup.subscribe(this.onVisualEditorAddSelectedElementToGroup);
  }

  private onVisualEditorAddSelectedElementToGroup = (el: ElementRef<HTMLElement>) => {
  }

  onDocumentKeydown = async (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'g' && this._componentVisualEditorService.selectedElementGroup.length >= 2) {
      const file = this._virtualFileTreeService.getFile(
        this._workspaceService.activeComponent,
        `${this._workspaceService.activeComponent}.component.html`);

      const parsedTreeResult = file.astTree as ParseTreeResult;

      const uniqueClassName =
        LatafiComponentDirective.tryGetComponentUniqueClassName(this._componentVisualEditorService.selectedElementGroup[0].nativeElement);

      const findResult = findElement(parsedTreeResult.rootNodes.map(x => x as Element), uniqueClassName);

      if (findResult) {
        file.content =
          file.content.slice(0, findResult.parentNode.startSourceSpan.end.offset)
          + `<div class=\"cide-component-container cide-component cide-unique-${Guid.create().toString()}\">`
          + file.content.slice(findResult.parentNode.startSourceSpan.end.offset, findResult.parentNode.endSourceSpan.start.offset)
          + '</div>'
          + file.content.slice(findResult.parentNode.endSourceSpan.start.offset, file.content.length);

        const res = await this._eventManagerService.EventManager.sendEvent<VirtualFile>(
          {
            eventType: EventType.WriteComponentFile,
            uniqueIdentifier: EventManager.generateUniqueIdentifire(),
            data: file
          }, false);

        this._componentVisualEditorService.updateLatafiComponentDirective();
      }
    } else if (event.ctrlKey && !event.altKey && event.key === 'b') {
      this.setEditorToBlock();
    } else if (event.ctrlKey && event.altKey && event.key === 'b') {
      this.setPreviouseBlock();
    }
  }

  private readonly _previouseBlockElemets: HTMLElement[] = [];

  private setPreviouseBlock() {
    if (this._previouseBlockElemets.length > 0) {
      const previouseBlockEl = this._previouseBlockElemets.pop();

      this._componentVisualEditorService.wrapperElement = previouseBlockEl;
      this._componentVisualEditorService.updateLatafiComponentDirective();
    }
  }

  private setEditorToBlock() {
    if (!this._componentVisualEditorService.selectedElement
      || !ComponentVisualEditorService.isComponentContainer(this._componentVisualEditorService.selectedElement.nativeElement)) {
      console.warn('Selected element is empty or not Component Container');
      return;
    }

    this._previouseBlockElemets.push(this._componentVisualEditorService.wrapperElement);

    this._componentVisualEditorService.wrapperElement = this._componentVisualEditorService.selectedElement.nativeElement;
    this._componentVisualEditorService.updateLatafiComponentDirective();
  }
}
