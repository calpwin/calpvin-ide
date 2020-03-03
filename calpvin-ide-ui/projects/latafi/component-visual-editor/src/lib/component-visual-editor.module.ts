import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { ComponentVisualEditorComponent } from './component-visual-editor.component';
import { ComponentVisualEditorService } from './services/component-visual-editor.service/component-visual-editor.service';
import { LatafiInjectableService } from '@latafi/core/src/lib/services/injectable.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentGroupingService } from './services/component-grouping/component-grouping.service';
import { StoreModule } from '@ngrx/store';
import { latafiComponentListReducer } from '../public-api';
import { VisualComponentEditorEffects } from './services/component-visual-editor.service/reducer/latafi-component-list.reducer';
import { EffectsModule } from '@ngrx/effects';


@NgModule({
  declarations: [ComponentVisualEditorComponent],
  imports: [
    DragDropModule,
    EffectsModule.forRoot([VisualComponentEditorEffects]),
    StoreModule.forFeature(
      'visualComponentEditorFeature',
      new InjectionToken<any>('latafiComponentListReducer', { factory: () => latafiComponentListReducer }))
  ],
  exports: [ComponentVisualEditorComponent, DragDropModule]
})
export class ComponentVisualEditorModule {
  static forRoot(): ModuleWithProviders<ComponentVisualEditorModule> {
    return {
      ngModule: ComponentVisualEditorModule,
      providers: [
        { provide: LatafiInjectableService, useExisting: ComponentVisualEditorService, multi: true },
        { provide: LatafiInjectableService, useExisting: ComponentGroupingService, multi: true }]
    };
  }
}
