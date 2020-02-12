import { NgModule, ModuleWithProviders } from '@angular/core';
import { ComponentPropertyEditorComponent } from './component-property-editor.component';
import { ComponentPropertyEditorService } from './component-property-editor.service';
import { ComponentVisualEditorModule } from 'projects/plankio/component-visual-editor/src/public-api';

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
