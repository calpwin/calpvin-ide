import { Injectable, ElementRef, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { LatafiInjectableService } from '@latafi/core/src/lib/services/injectable.service';
import { ComponentVisualEditorService } from '@latafi/component-visual-editor';
import { ComponentPropertyEditorComponent } from './component-property-editor.component';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class ComponentPropertyEditorService extends LatafiInjectableService {
  constructor(
    private readonly _componentVisualEditorService: ComponentVisualEditorService,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly _store: Store<any>) {
    super();
  }

  private _propertyEditorComponentRef: ComponentRef<ComponentPropertyEditorComponent>;

  onAppInit() {
  }

  onBaseAppConstruct() {
    this._componentVisualEditorService.onPropertyEditorWrapperInit.subscribe(this.onPropertyEditorWrapperInit);
  }

  private onPropertyEditorWrapperInit = (wrapper: ViewContainerRef) => {
    const compFactory = this.componentFactoryResolver.resolveComponentFactory(ComponentPropertyEditorComponent);
    this._propertyEditorComponentRef = wrapper.createComponent(compFactory);
  }
}
