import { Component, OnInit, ElementRef, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { ComponentVisualEditorService, lastSelectedComponentSelector, wrapperComponentSelector } from '@latafi/component-visual-editor/src/public-api';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { FlexboxWrapperModel } from './flexbox-wrapper-model';
import { Store } from '@ngrx/store';
import { LatafiComponent } from '@latafi/component-visual-editor/src/lib/services/component-visual-editor.service/reducer/latafi-component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'latafi-component-property-editor',
  templateUrl: 'component-property-editor.component.html',
  styleUrls: ['component-property-editor.component.scss']
})
export class ComponentPropertyEditorComponent implements OnInit {

  constructor(
    private readonly _componentVisualEditorService: ComponentVisualEditorService,
    private readonly _changeDedectionRef: ChangeDetectorRef,
    private readonly _store: Store<any>) {
  }

  cssProperty: string;
  cssValue: string;
  selectedComponent?: LatafiComponent;

  private _flexboxWrapperModel = new FlexboxWrapperModel();
  private _wrapperComponent?: LatafiComponent;

  ngOnInit(): void {
    this._store.select(lastSelectedComponentSelector).subscribe(this.onEditorComponentSelect);
    this._store.select(wrapperComponentSelector).subscribe(c => this._wrapperComponent = c);

    this._changeDedectionRef.detectChanges();
  }

  onCssValueChange = (event: KeyboardEvent) => {
    this._componentVisualEditorService.setElementStyle(this.cssProperty, this.cssValue);
  }

  onFlexboxActionChange(event: MatButtonToggleChange) {
    if (!this._wrapperComponent) { return; }

    const wrapperEl = this._wrapperComponent.baseEl;

    const mainAxis = this._flexboxWrapperModel.flexDirection === 'row' ? 'justify-content' : 'align-items';
    const assendAxis = this._flexboxWrapperModel.flexDirection === 'column' ? 'justify-content' : 'align-items';

    switch (event.value) {
      case 'left':
        this._componentVisualEditorService.setElementStyle(mainAxis, 'flex-start', wrapperEl);
        break;
      case 'center_vertical':
        this._componentVisualEditorService.setElementStyle(mainAxis, 'center', wrapperEl);
        break;
      case 'right':
        this._componentVisualEditorService.setElementStyle(mainAxis, 'flex-end', wrapperEl);
        break;

      case 'top':
        this._componentVisualEditorService.setElementStyle(
          assendAxis, 'flex-start', wrapperEl);
        break;
      case 'center_horizontal':
        this._componentVisualEditorService.setElementStyle(assendAxis, 'center', wrapperEl);
        break;
      case 'bottom':
        this._componentVisualEditorService.setElementStyle(assendAxis, 'flex-end', wrapperEl);
        break;
      default:
        break;
    }
  }

  async onWrapperElFlexDirectionChange(event: MatButtonToggleChange) {
    if (!this._wrapperComponent) { return; }

    const wrapperEl = this._wrapperComponent.baseEl;

    if (event.value === 'none') {
      this._flexboxWrapperModel.flexDirection = 'none';
      await this.setWrapperElDisplayMod(wrapperEl, 'none');
    } else if (event.value === 'absolute') {
      this._flexboxWrapperModel.flexDirection = 'absolute';
      await this.setWrapperElDisplayMod(wrapperEl, 'absolute');
    } else if (event.value === 'row') {
      this._flexboxWrapperModel.flexDirection = 'row';
      await this.setWrapperElDisplayMod(wrapperEl, 'row');
      await this._componentVisualEditorService.setElementStyle('flex-direction', 'row', wrapperEl);
    } else if (event.value === 'column') {
      this._flexboxWrapperModel.flexDirection = 'column';
      await this.setWrapperElDisplayMod(wrapperEl, 'column');
      await this._componentVisualEditorService.setElementStyle(
        'flex-direction', 'column', wrapperEl);
    }
  }

  private onEditorComponentSelect = (comp: LatafiComponent) => {
    this.selectedComponent = comp;
    this._changeDedectionRef.detectChanges();
  }

  private async setWrapperElDisplayMod(wrapperEl: HTMLElement, displayVal: 'none' | 'absolute' | 'row' | 'column') {
    await this._componentVisualEditorService.resetWrapperElementsPosition();

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
