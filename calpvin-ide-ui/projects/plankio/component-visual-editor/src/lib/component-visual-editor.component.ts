import { Component, OnInit, ComponentFactoryResolver, ViewChild, ElementRef } from '@angular/core';
import { ComponentVisualEditorService } from '../public-api';

@Component({
  selector: 'plunkio-component-visual-editor',
  templateUrl: 'component-visual-editor.component.html',
  styleUrls: ['component-visual-editor.component.scss']
})
export class ComponentVisualEditorComponent implements OnInit {

  @ViewChild('componentPropertyWrapper') componentPropertyWrapper: ElementRef<HTMLElement>;

  constructor(
    private readonly _componentFactoryResolver: ComponentFactoryResolver,
    private readonly _componentVisualEditorService: ComponentVisualEditorService
  ) { }

  ngOnInit(): void {
    this._componentFactoryResolver.resolveComponentFactory()
  }

}
