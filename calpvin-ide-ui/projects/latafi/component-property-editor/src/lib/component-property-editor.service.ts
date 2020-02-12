import { Injectable, ElementRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ILatafiExtension } from '@latafi/core/src/lib/services/i-extenson.service';
import { ComponentVisualEditorService } from '@latafi/component-visual-editor/src/lib/component-visual-editor.service';
import { ComponentPropertyEditorComponent } from './component-property-editor.component';

@Injectable({
  providedIn: 'root'
})
export class ComponentPropertyEditorService extends ILatafiExtension {
  constructor(
    private readonly _componentVisualEditorService: ComponentVisualEditorService,
    private readonly componentFactoryResolver: ComponentFactoryResolver) {
    super();
  }

  onAppInit() {
  }

  onBaseAppConstruct() {
    this._componentVisualEditorService.onPropertyEditorWrapperInit.subscribe(this.onPropertyEditorWrapperInit);
  }

  private onPropertyEditorWrapperInit = (wrapper: ViewContainerRef) => {
    const compFactory = this.componentFactoryResolver.resolveComponentFactory(ComponentPropertyEditorComponent);

    const compRef = wrapper.createComponent(compFactory);

    console.log(compRef);

  }
}
