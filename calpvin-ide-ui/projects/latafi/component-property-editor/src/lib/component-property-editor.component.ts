import { Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { ComponentVisualEditorService } from '@latafi/component-visual-editor/src/public-api';

@Component({
  selector: 'latafi-component-property-editor',
  templateUrl: 'component-property-editor.component.html',
  styleUrls: ['component-property-editor.component.scss']
})
export class ComponentPropertyEditorComponent implements OnInit {

  constructor(
    private readonly _componentVisualEditorService: ComponentVisualEditorService,
    private readonly _changeDedectionRef: ChangeDetectorRef
  ) {
  }


  private _editorSelectedEl: ElementRef<HTMLElement>;
  public get editorSelectedEl(): ElementRef<HTMLElement> {
    return this._editorSelectedEl;
  }
  public set editorSelectedEl(v: ElementRef<HTMLElement>) {
    this._editorSelectedEl = v;

    this._changeDedectionRef.detectChanges();
  }


  ngOnInit(): void {
  }
}
