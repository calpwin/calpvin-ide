import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { ComponentVisualEditorComponent } from './component-visual-editor.component';
import { ComponentVisualEditorService } from './services/component-visual-editor.service/component-visual-editor.service';
import { LatafiInjectableService } from '@latafi/core/src/lib/services/injectable.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentGroupingService } from './services/component-grouping.service';
import { StoreModule } from '@ngrx/store';
import { latafiComponentListReducer } from '../public-api';
import { initialLatafiComponentListState } from './services/component-visual-editor.service/reducer/latafi-component-list.reducer';


@NgModule({
  declarations: [ComponentVisualEditorComponent],
  imports: [
    DragDropModule,
    StoreModule.forFeature(
      'visualComponentEditorFeature',
      new InjectionToken<any>('latafiComponentListReducer', { factory: () => ({ latafiComponentListState: latafiComponentListReducer }) }))
  ],
  exports: [ComponentVisualEditorComponent, DragDropModule]
})
export class ComponentVisualEditorModule {
  static forRoot(): ModuleWithProviders<ComponentVisualEditorModule> {
    return {
      ngModule: ComponentVisualEditorModule,
      providers: [
        { provide: LatafiInjectableService, useClass: ComponentVisualEditorService, multi: true },
        { provide: LatafiInjectableService, useClass: ComponentGroupingService, multi: true }]
    };
  }
}
