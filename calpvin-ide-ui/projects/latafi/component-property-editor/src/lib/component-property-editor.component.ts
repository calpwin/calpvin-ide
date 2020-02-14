import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ComponentVisualEditorService } from '@latafi/component-visual-editor/src/public-api';
import { WorkspaceService } from '@latafi/core/src/lib/services/workspace.service';
import { VirtualFileTreeService } from '@latafi/core/src/lib/services/virtual-tree.service';
import { tryGetNode, setCssValue } from '@latafi/core/src/lib/extension/csstree-walker.extension';
import { CssNode, Rule } from 'css-tree';
import * as csstree from 'css-tree';
import { LatafiComponentDirective } from '@latafi/component-visual-editor/src/lib/directives/latafi-component.directive';
import { EventManagerService } from '@latafi/core/src/lib/services/event-manager.service';
import { VirtualFile, EventType, EventManager, IdeFormatDocumentCommandData } from 'calpvin-ide-shared';

@Component({
  selector: 'latafi-component-property-editor',
  templateUrl: 'component-property-editor.component.html',
  styleUrls: ['component-property-editor.component.scss']
})
export class ComponentPropertyEditorComponent implements OnInit {

  constructor(
    private readonly _componentVisualEditorService: ComponentVisualEditorService,
    private readonly _changeDedectionRef: ChangeDetectorRef,
    private readonly _workspaceService: WorkspaceService,
    private readonly _virtualFileTreeService: VirtualFileTreeService,
    private readonly _eventManagerService: EventManagerService) {
  }

  cssProperty: string;
  cssValue: string;

  private _editorSelectedEl: ElementRef<HTMLElement>;
  public get editorSelectedEl(): ElementRef<HTMLElement> {
    return this._editorSelectedEl;
  }
  public set editorSelectedEl(v: ElementRef<HTMLElement>) {
    this._editorSelectedEl = v;

    this._changeDedectionRef.detectChanges();
  }


  ngOnInit(): void {
    this._changeDedectionRef.detectChanges();
  }

  async onCssValueChange(event: KeyboardEvent) {
    const file = this._virtualFileTreeService.getFile(
      this._workspaceService.activeComponent,
      `${this._workspaceService.activeComponent}.component.scss`);

    const elStyle = getComputedStyle(this._editorSelectedEl.nativeElement);

    const uniqueClassName = LatafiComponentDirective.tryGetComponentUniqueClassName(this._editorSelectedEl.nativeElement);

    const node = tryGetNode(file.astTree as CssNode, uniqueClassName);
    setCssValue(node as Rule, this.cssProperty, this.cssValue);

    file.content = csstree.generate(file.astTree);

    await this._eventManagerService.EventManager.sendEvent<VirtualFile>(
      {
        eventType: EventType.WriteComponentFile,
        uniqueIdentifier: EventManager.generateUniqueIdentifire(),
        data: file
      }, false);

    await this._eventManagerService.EventManager.sendEvent<IdeFormatDocumentCommandData>(
      {
        eventType: EventType.IdeFormatDocument,
        uniqueIdentifier: EventManager.generateUniqueIdentifire(),
        data: { uri: file.fileName }
      }, false);

    this._componentVisualEditorService.selectedElement = undefined;
  }

  onFlexboxActionChange(e) {
    console.log(e);

  }
}
