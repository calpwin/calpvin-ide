import { NgModule, ModuleWithProviders } from '@angular/core';
import { ComponentPropertyEditorComponent } from './component-property-editor.component';
import { ComponentPropertyEditorService } from './component-property-editor.service';

@NgModule({
  declarations: [ComponentPropertyEditorComponent],
  imports: [
  ],
  exports: [ComponentPropertyEditorComponent]
})
export class ComponentPropertyEditorModule {
  static forRoot(): ModuleWithProviders<ComponentPropertyEditorModule> {
    return {
      ngModule: ComponentPropertyEditorModule,
      providers: [
        ComponentPropertyEditorService]
    };
  }
}
