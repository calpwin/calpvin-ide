import { Component, OnInit, ElementRef } from '@angular/core';
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
    _componentVisualEditorService.onPropertyEditorWrapperInit.subscribe(this.onComponentVisualEditorPropertyWrapperInit);
  }

  ngOnInit(): void {
  }

  onComponentVisualEditorPropertyWrapperInit = (propertyWrapper: ElementRef<HTMLElement>) => {
    console.log(propertyWrapper);
  }
}
