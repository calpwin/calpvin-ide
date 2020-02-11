import { Injectable, ElementRef, ComponentFactoryResolver, Type } from '@angular/core';
import { ComponentPropertyEditorService } from 'projects/plankio/component-property-editor/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class ComponentVisualEditorService {

  constructor(
    private readonly _componentPropertyEditorService: ComponentPropertyEditorService) {
  }

  private _selectedElement: ElementRef | undefined;
  public get selectedElement(): ElementRef | undefined {
    return this._selectedElement;
  }
  public set selectedElement(v: ElementRef | undefined) {
    this._selectedElement = v;

    this._componentPropertyEditorService.setElement(v);
  }

  private _propertyEditorComponent?: Type<any>;
  public get propertyEditorComponent(): Type<any> {
    return this._propertyEditorComponent;
  }
  public set propertyEditorComponent(v: Type<any>) {
    this._propertyEditorComponent = v;
  }
}
