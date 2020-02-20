import { NgModule, ModuleWithProviders } from '@angular/core';
import { ComponentVisualEditorComponent } from './component-visual-editor.component';
import { ComponentVisualEditorService } from './component-visual-editor.service';
import { LatafiInjectableService } from '@latafi/core/src/lib/services/injectable.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LatafiComponentGroupingService } from './services/latafi-component-grouping.service';


@NgModule({
  declarations: [ComponentVisualEditorComponent],
  imports: [
    DragDropModule
  ],
  exports: [ComponentVisualEditorComponent, DragDropModule]
})
export class ComponentVisualEditorModule {
  static forRoot(): ModuleWithProviders<ComponentVisualEditorModule> {
    return {
      ngModule: ComponentVisualEditorModule,
      providers: [
        { provide: LatafiInjectableService, useClass: ComponentVisualEditorService, multi: true },
        { provide: LatafiInjectableService, useClass: LatafiComponentGroupingService, multi: true }]
    };
  }
}
