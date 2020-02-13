import { NgModule, ModuleWithProviders } from '@angular/core';
import { ComponentPropertyEditorComponent } from './component-property-editor.component';
import { ComponentPropertyEditorService } from './component-property-editor.service';
import { ILatafiExtension } from '@latafi/core/src/lib/services/i-extenson.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [ComponentPropertyEditorComponent],
  imports: [
    MatInputModule,
    MatFormFieldModule
  ],
  exports: [
    ComponentPropertyEditorComponent,
    MatInputModule,
    MatFormFieldModule]
})
export class ComponentPropertyEditorModule {
  static forRoot(): ModuleWithProviders<ComponentPropertyEditorModule> {
    return {
      ngModule: ComponentPropertyEditorModule,
      providers: [
        { provide: ILatafiExtension, useClass: ComponentPropertyEditorService, multi: true }]
    };
  }
}
