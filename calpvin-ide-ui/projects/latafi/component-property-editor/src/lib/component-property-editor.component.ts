import { Component, OnInit, ElementRef, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { ComponentVisualEditorService } from '@latafi/component-visual-editor/src/public-api';
import { WorkspaceService } from '@latafi/core/src/lib/services/workspace.service';
import { VirtualFileTreeService } from '@latafi/core/src/lib/services/virtual-tree.service';
import { tryGetNode, setCssValue } from '@latafi/core/src/lib/extension/csstree-walker.extension';
import { CssNode, Rule } from 'css-tree';
import * as csstree from 'css-tree';
import { LatafiComponentDirective } from '@latafi/component-visual-editor/src/lib/directives/latafi-component.directive';
import { EventManagerService } from '@latafi/core/src/lib/services/event-manager.service';
import { VirtualFile, EventType, EventManager, IdeFormatDocumentCommandData } from 'calpvin-ide-shared';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { FlexboxWrapperModel } from './flexbox-wrapper-model';

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
    private readonly _eventManagerService: EventManagerService,
    private readonly _renderer2: Renderer2) {
  }

  cssProperty: string;
  cssValue: string;

  private _flexboxWrapperModel = new FlexboxWrapperModel();

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

  onFlexboxActionChange(event: MatButtonToggleChange) {
    if (!this._componentVisualEditorService.wrapperElement) { return; }

    const mainAxis = this._flexboxWrapperModel.flexDirection === 'row' ? 'justify-content' : 'align-items';
    const assendAxis = this._flexboxWrapperModel.flexDirection === 'column' ? 'justify-content' : 'align-items';

    switch (event.value) {
      case 'left':
        this._renderer2.setStyle(this._componentVisualEditorService.wrapperElement, mainAxis, 'flex-start');
        break;
      case 'center_vertical':
        this._renderer2.setStyle(this._componentVisualEditorService.wrapperElement, mainAxis, 'center');
        break;
      case 'right':
        this._renderer2.setStyle(this._componentVisualEditorService.wrapperElement, mainAxis, 'flex-end');
        break;

      case 'top':
        this._renderer2.setStyle(this._componentVisualEditorService.wrapperElement, assendAxis, 'flex-start');
        break;
      case 'center_horizontal':
        this._renderer2.setStyle(this._componentVisualEditorService.wrapperElement, assendAxis, 'center');
        break;
      case 'bottom':
        this._renderer2.setStyle(this._componentVisualEditorService.wrapperElement, assendAxis, 'flex-end');
        break;
      default:
        break;
    }
  }

  onWrapperElFlexDirectionChange(event: MatButtonToggleChange) {
    if (!this._componentVisualEditorService.wrapperElement) { return; }

    if (event.value === 'none') {
      this._flexboxWrapperModel.flexDirection = 'none';
      this.setWrapperElDisplayMod(this._componentVisualEditorService.wrapperElement, 'none');
    } else if (event.value === 'absolute') {
      this._flexboxWrapperModel.flexDirection = 'absolute';
      this.setWrapperElDisplayMod(this._componentVisualEditorService.wrapperElement, 'absolute');
    } else if (event.value === 'row') {
      this._flexboxWrapperModel.flexDirection = 'row';
      this.setWrapperElDisplayMod(this._componentVisualEditorService.wrapperElement, 'row');
      this._renderer2.setStyle(this._componentVisualEditorService.wrapperElement, 'flex-direction', 'row');
    } else if (event.value === 'column') {
      this._flexboxWrapperModel.flexDirection = 'column';
      this.setWrapperElDisplayMod(this._componentVisualEditorService.wrapperElement, 'column');
      this._renderer2.setStyle(this._componentVisualEditorService.wrapperElement, 'flex-direction', 'column');
    }
  }

  private setWrapperElDisplayMod(wrapperEl: HTMLElement, displayVal: 'none' | 'absolute' | 'row' | 'column') {

    if (displayVal === 'row' || displayVal === 'column') {
      this._renderer2.setStyle(wrapperEl, 'display', 'flex');
    } else {
      this._renderer2.setStyle(wrapperEl, 'display', 'block');
    }

    for (let index = 0; index < wrapperEl.children.length; index++) {
      const element = wrapperEl.children[index];

      if (displayVal === 'absolute') {
        this._renderer2.setStyle(element, 'position', 'absolute');
      } else {
        this._renderer2.setStyle(element, 'position', 'relative');
      }
    }
  }
}
