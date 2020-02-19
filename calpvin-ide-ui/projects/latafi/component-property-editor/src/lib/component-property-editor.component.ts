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

  onCssValueChange(event: KeyboardEvent) {
    this._componentVisualEditorService.setElementStyle(this.cssProperty, this.cssValue);
  }

  onFlexboxActionChange(event: MatButtonToggleChange) {
    if (!this._componentVisualEditorService.wrapperElement) { return; }

    const mainAxis = this._flexboxWrapperModel.flexDirection === 'row' ? 'justify-content' : 'align-items';
    const assendAxis = this._flexboxWrapperModel.flexDirection === 'column' ? 'justify-content' : 'align-items';

    switch (event.value) {
      case 'left':
        this._componentVisualEditorService.setElementStyle(mainAxis, 'flex-start', this._componentVisualEditorService.wrapperElement);
        break;
      case 'center_vertical':
        this._componentVisualEditorService.setElementStyle(mainAxis, 'center', this._componentVisualEditorService.wrapperElement);
        break;
      case 'right':
        this._componentVisualEditorService.setElementStyle(mainAxis, 'flex-end', this._componentVisualEditorService.wrapperElement);
        break;

      case 'top':
        this._componentVisualEditorService.setElementStyle(
          assendAxis, 'flex-start', this._componentVisualEditorService.wrapperElement);
        break;
      case 'center_horizontal':
        this._componentVisualEditorService.setElementStyle(assendAxis, 'center', this._componentVisualEditorService.wrapperElement);
        break;
      case 'bottom':
        this._componentVisualEditorService.setElementStyle(assendAxis, 'flex-end', this._componentVisualEditorService.wrapperElement);
        break;
      default:
        break;
    }
  }

  async onWrapperElFlexDirectionChange(event: MatButtonToggleChange) {
    if (!this._componentVisualEditorService.wrapperElement) { return; }

    if (event.value === 'none') {
      this._flexboxWrapperModel.flexDirection = 'none';
      await this.setWrapperElDisplayMod(this._componentVisualEditorService.wrapperElement, 'none');
    } else if (event.value === 'absolute') {
      this._flexboxWrapperModel.flexDirection = 'absolute';
      await this.setWrapperElDisplayMod(this._componentVisualEditorService.wrapperElement, 'absolute');
    } else if (event.value === 'row') {
      this._flexboxWrapperModel.flexDirection = 'row';
      await this.setWrapperElDisplayMod(this._componentVisualEditorService.wrapperElement, 'row');
      await this._componentVisualEditorService.setElementStyle('flex-direction', 'row', this._componentVisualEditorService.wrapperElement);
    } else if (event.value === 'column') {
      this._flexboxWrapperModel.flexDirection = 'column';
      await this.setWrapperElDisplayMod(this._componentVisualEditorService.wrapperElement, 'column');
      await this._componentVisualEditorService.setElementStyle(
        'flex-direction', 'column', this._componentVisualEditorService.wrapperElement);
    }
  }

  private async setWrapperElDisplayMod(wrapperEl: HTMLElement, displayVal: 'none' | 'absolute' | 'row' | 'column') {
    if (displayVal === 'row' || displayVal === 'column') {
      await this._componentVisualEditorService.setElementStyle('display', 'flex', wrapperEl);
    } else {
      await this._componentVisualEditorService.setElementStyle('display', 'block', wrapperEl);
    }

    for (let index = 0; index < wrapperEl.children.length; index++) {
      const element = wrapperEl.children[index];

      if (displayVal === 'absolute') {
        await this._componentVisualEditorService.setElementStyle('position', 'absolute', element as HTMLElement);
      } else {
        await this._componentVisualEditorService.setElementStyle('position', 'relative', element as HTMLElement);
      }
    }
  }
}
