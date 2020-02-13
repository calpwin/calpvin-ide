import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ComponentVisualEditorService } from '@latafi/component-visual-editor/src/public-api';

@Component({
  selector: 'latafi-component-property-editor',
  templateUrl: 'component-property-editor.component.html',
  styleUrls: ['component-property-editor.component.scss']
})
export class ComponentPropertyEditorComponent implements OnInit {

  constructor(
    private readonly _componentVisualEditorService: ComponentVisualEditorService
  ) {
  }

  @Input() editorSelectedEl: ElementRef<HTMLElement>;

  ngOnInit(): void {
  }
}
