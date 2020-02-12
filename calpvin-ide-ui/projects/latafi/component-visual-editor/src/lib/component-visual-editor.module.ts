import { NgModule, ModuleWithProviders } from '@angular/core';
import { ComponentVisualEditorComponent } from './component-visual-editor.component';
import { ComponentVisualEditorService } from './component-visual-editor.service';


@NgModule({
  declarations: [ComponentVisualEditorComponent],
  imports: [
  ],
  exports: [ComponentVisualEditorComponent]
})
export class ComponentVisualEditorModule {
  static forRoot(): ModuleWithProviders<ComponentVisualEditorModule> {
    return {
      ngModule: ComponentVisualEditorModule,
      providers: [
        ComponentVisualEditorService]
    };
  }
}
