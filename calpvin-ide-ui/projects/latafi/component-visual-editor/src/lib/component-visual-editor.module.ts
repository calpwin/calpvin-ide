import { NgModule, ModuleWithProviders } from '@angular/core';
import { ComponentVisualEditorComponent } from './component-visual-editor.component';
import { ComponentVisualEditorService } from './component-visual-editor.service';
import { ILatafiExtension } from '@latafi/core/src/lib/services/i-extenson.service';


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
        { provide: ILatafiExtension, useClass: ComponentVisualEditorService, multi: true }]
    };
  }
}
