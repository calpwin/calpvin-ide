import { Injectable, ElementRef, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { LatafiInjectableService } from '@latafi/core/src/lib/services/injectable.service';
import { ComponentVisualEditorService } from '@latafi/component-visual-editor/src/lib/component-visual-editor.service';
import { ComponentPropertyEditorComponent } from './component-property-editor.component';

@Injectable({
  providedIn: 'root'
})
export class ComponentPropertyEditorService extends LatafiInjectableService {
  constructor(
    private readonly _componentVisualEditorService: ComponentVisualEditorService,
    private readonly componentFactoryResolver: ComponentFactoryResolver) {
    super();
  }

  private _propertyEditorComponentRef: ComponentRef<ComponentPropertyEditorComponent>;

  onAppInit() {
  }

  onBaseAppConstruct() {
    this._componentVisualEditorService.onPropertyEditorWrapperInit.subscribe(this.onPropertyEditorWrapperInit);
    this._componentVisualEditorService.onSelectElement.subscribe(this.onEditorElementSelect);
  }

  private onPropertyEditorWrapperInit = (wrapper: ViewContainerRef) => {
    const compFactory = this.componentFactoryResolver.resolveComponentFactory(ComponentPropertyEditorComponent);
    this._propertyEditorComponentRef = wrapper.createComponent(compFactory);
  }

  private onEditorElementSelect = (el: ElementRef) => {
      this._propertyEditorComponentRef.instance.editorSelectedEl = el;
  }
}
