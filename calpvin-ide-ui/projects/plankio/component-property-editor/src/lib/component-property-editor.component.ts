import { Component, OnInit } from '@angular/core';
import { ComponentVisualEditorService } from 'projects/plankio/component-visual-editor/src/public-api';

@Component({
  selector: 'lib-component-property-editor',
  template: `
    <p>
      component-property-editor works!
    </p>
  `,
  styles: []
})
export class ComponentPropertyEditorComponent implements OnInit {

  constructor(
    private readonly _componentVisualEditorService: ComponentVisualEditorService
  ) { }

  ngOnInit(): void {
  }

}
