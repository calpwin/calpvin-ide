import { Injectable, ElementRef } from '@angular/core';
import Split from 'split.js';
import { ComponentVisualEditorService } from '@latafi/component-visual-editor';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private readonly _componentVisualEditorService: ComponentVisualEditorService) {

  }

  private _canvaEditorLayoutElRef: ElementRef;
  public get canvaEditorLayoutElRef(): ElementRef {
    return this._canvaEditorLayoutElRef;
  }
  public set canvaEditorLayoutElRef(v: ElementRef) {
    this._canvaEditorLayoutElRef = v;

    this.onSetLayout();
  }

  private _ideLayoutElRef: ElementRef;
  public get ideLayoutElRef(): ElementRef {
    return this._ideLayoutElRef;
  }
  public set ideLayoutElRef(v: ElementRef) {
    this._ideLayoutElRef = v;

    this.onSetLayout();
  }

  private _propertyEditorLayoutElRef: ElementRef;
  public get propertyEditorLayoutElRef(): ElementRef {
    return this._propertyEditorLayoutElRef;
  }
  public set propertyEditorLayoutElRef(v: ElementRef) {
    this._propertyEditorLayoutElRef = v;

    this.onSetLayout();
  }

  private _canvaEditorToIdeLayoutSpliter;
  private _canvaEditorToPropertyEditorSpliter;

  private _isPropertyEditorLayoutCollapse = false;
  private _isIdeLayoutCollapse = false;

  collapse(toggle = true) {
    if (toggle) {
      this._canvaEditorToPropertyEditorSpliter.setSizes(this._isPropertyEditorLayoutCollapse ? [75, 25] : [100, 0]);
      this._canvaEditorToIdeLayoutSpliter.setSizes(this._isIdeLayoutCollapse ? [50, 50] : [100, 0]);

      this._isPropertyEditorLayoutCollapse = !this._isPropertyEditorLayoutCollapse;
      this._isIdeLayoutCollapse = !this._isIdeLayoutCollapse;
    } else {
      this._canvaEditorToPropertyEditorSpliter.setSizes([100, 0]);
      this._canvaEditorToIdeLayoutSpliter.setSizes([100, 0]);

      this._isPropertyEditorLayoutCollapse = true;
      this._isIdeLayoutCollapse = true;
    }

    if (this._isIdeLayoutCollapse) { window.focus(); }
  }

  private onSetLayout() {
    if (!this._canvaEditorToIdeLayoutSpliter && this._canvaEditorLayoutElRef && this._ideLayoutElRef) {
      this._canvaEditorToIdeLayoutSpliter = Split([this._canvaEditorLayoutElRef.nativeElement, this._ideLayoutElRef.nativeElement], {
        direction: 'vertical',
        sizes: [50, 50],
        minSize: [0, 0],
        gutterSize: 15
      });
    }

    if (!this._canvaEditorToPropertyEditorSpliter && this._canvaEditorLayoutElRef && this._propertyEditorLayoutElRef) {
      const canvaWrapper = this._componentVisualEditorService.canvaEditorComponent.componentCanvaEditorWrapper.nativeElement;

      this._canvaEditorToPropertyEditorSpliter = Split([canvaWrapper, this._propertyEditorLayoutElRef.nativeElement], {
        sizes: [75, 25],
        minSize: [350, 350],
        gutterSize: 15
      });
    }
  }
}
