import { Injectable, ElementRef, RendererFactory2, Renderer2 } from '@angular/core';
import { ComponentVisualEditorService } from '../../services/component-visual-editor.service/component-visual-editor.service';
import { LatafiInjectableService } from '@latafi/core/src/lib/services/injectable.service';
import { VirtualFileTreeService } from '@latafi/core/src/lib/services/virtual-tree.service';
import { WorkspaceService } from '@latafi/core/src/lib/services/workspace.service';
import { ParseTreeResult, Element } from '@angular/compiler';
import { findElement } from '@latafi/core/src/lib/extension/angular-html-elements.extension';
import { LatafiComponentDirective } from '../../directives/latafi-component.directive';
import { Guid } from 'guid-typescript';
import { Store } from '@ngrx/store';
import { selectedComponentsSelector, lastSelectedComponentSelector, wrapperComponentSelector, wrapperComponentsRebuildAction, setWrapperComponentAction, addWrapperComponentAction } from '../../../public-api';
import { LatafiComponent, LatafiComponentDisplayMode } from '../component-visual-editor.service/reducer/latafi-component';

@Injectable({
  providedIn: 'root'
})
export class ComponentGroupingService extends LatafiInjectableService {

  constructor(
    private readonly _store: Store<any>,
    private readonly _componentVisualEditorService: ComponentVisualEditorService,
    private readonly _virtualFileTreeService: VirtualFileTreeService,
    private readonly _workspaceService: WorkspaceService,
    _rendererFactory: RendererFactory2) {
    super();

    this._renderer = _rendererFactory.createRenderer(null, null);
    this._renderer.listen('document', 'keydown', event => { this.onDocumentKeydown(event); });
  }

  private readonly _renderer: Renderer2;

  private _selectedComponents: LatafiComponent[] = [];
  private _selectedComponent?: LatafiComponent;
  private _wrapperComponent?: LatafiComponent;

  private readonly _previouseBlockComponents: LatafiComponent[] = [];

  onBaseAppConstruct() {
    // this._componentVisualEditorService.onAddSelectElementToGroup.subscribe(this.onVisualEditorAddSelectedElementToGroup);
  }

  onAppInit() {
    this._store.select(selectedComponentsSelector).subscribe(comps => this._selectedComponents = comps);
    this._store.select(lastSelectedComponentSelector).subscribe(c => this._selectedComponent = c);
    this._store.select(wrapperComponentSelector).subscribe(c => this._wrapperComponent = c);
  }

  // private onVisualEditorAddSelectedElementToGroup = (el: ElementRef<HTMLElement>) => {
  // }

  onDocumentKeydown = async (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'g' && this._selectedComponents.length >= 2) {
      const file = this._virtualFileTreeService.getFile(
        this._workspaceService.activeComponent,
        `${this._workspaceService.activeComponent}.component.html`);

      const parsedTreeResult = file.astTree as ParseTreeResult;

      const firstGroupEl = this._selectedComponents[0].baseEl;
      const newGuid = Guid.create().toString();
      const wrapperEl = this._renderer.createElement('div') as HTMLElement;
      wrapperEl.classList.add('cide-component-container', 'cide-component', `cide-unique-${newGuid}`);
      wrapperEl.style.position = 'relative';
      const parentEl = firstGroupEl.parentElement;

      this._selectedComponents.map(x => x.baseEl).forEach(el => {
        parentEl.removeChild(el);
        wrapperEl.appendChild(el);
      });
      parentEl.appendChild(wrapperEl);

      this.setBlockDimenisions(wrapperEl);

      const uniqueClassName =
        LatafiComponentDirective.tryGetComponentUniqueClassName(firstGroupEl);

      const findResult = findElement(parsedTreeResult.rootNodes.map(x => x as Element), uniqueClassName);

      if (findResult) {
        file.content =
          file.content.slice(0, findResult.parentNode.startSourceSpan.end.offset)
          + `<div class=\"cide-component-container cide-component cide-unique-${newGuid}\">`
          + file.content.slice(findResult.parentNode.startSourceSpan.end.offset, findResult.parentNode.endSourceSpan.start.offset)
          + '</div>'
          + file.content.slice(findResult.parentNode.endSourceSpan.start.offset, file.content.length);

        // const res = await this._eventManagerService.EventManager.sendEvent<VirtualFile>(
        //   {
        //     eventType: EventType.WriteComponentFile,
        //     uniqueIdentifier: EventManager.generateUniqueIdentifire(),
        //     data: file
        //   }, false);

        // this._componentVisualEditorService.updateLatafiComponentDirective();
      }
    } else if (event.ctrlKey && !event.altKey && event.key === 'b') {
      this.setEditorToBlock();
    } else if (event.ctrlKey && event.altKey && event.key === 'b') {
      this.setPreviouseBlock();
    }
  }

  private setPreviouseBlock() {
    if (this._previouseBlockComponents.length > 0) {
      const previouseBlockComp = this._previouseBlockComponents.pop();

      this._store.dispatch(wrapperComponentsRebuildAction({ components: [previouseBlockComp] }));

      this._store.dispatch(setWrapperComponentAction({
        uniqueClassName: previouseBlockComp.uniqueClassName,
        wrapperComponentId: previouseBlockComp.wrapperComponentId
      }));

      // this._componentVisualEditorService.wrapperElement = previouseBlockEl;

      // this._componentVisualEditorService.updateLatafiComponentDirective();
    }
  }

  private setEditorToBlock() {
    if (!this._selectedComponent
      || !ComponentVisualEditorService.isComponentContainer(this._selectedComponent.baseEl)) {
      console.warn('Selected element is empty or not Component Container');
      return;
    }

    this._previouseBlockComponents.push(this._wrapperComponent);

    this._store.dispatch(setWrapperComponentAction({
      uniqueClassName: this._selectedComponent.uniqueClassName,
      wrapperComponentId: this._wrapperComponent.uniqueClassName
    }));

    // this._componentVisualEditorService.wrapperElement = this._componentVisualEditorService.selectedElement.nativeElement; !!
    // this._componentVisualEditorService.updateLatafiComponentDirective();

    // this.setBlockDimenisions(this._componentVisualEditorService.wrapperElement); !!
  }

  setBlockDimenisions(blockEL: HTMLElement) {
    let right = 0;
    let bottom = 0;

    for (let index = 0; index < blockEL.children.length; index++) {
      const element = blockEL.children[index];
      const boundingClientRect = element.getBoundingClientRect();

      if (right < boundingClientRect.right) { right = boundingClientRect.right; }
      if (bottom < boundingClientRect.bottom) { bottom = boundingClientRect.bottom; }
    }

    this._componentVisualEditorService.setElementStyle('width', right + 'px', blockEL);
    this._componentVisualEditorService.setElementStyle('height', bottom + 'px', blockEL);
  }
}
