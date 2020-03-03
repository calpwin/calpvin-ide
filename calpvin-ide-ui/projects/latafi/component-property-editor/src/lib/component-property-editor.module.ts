import { NgModule, ModuleWithProviders } from '@angular/core';
import { ComponentPropertyEditorComponent } from './component-property-editor.component';
import { ComponentPropertyEditorService } from './component-property-editor.service';
import { LatafiInjectableService } from '@latafi/core/src/lib/services/injectable.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [ComponentPropertyEditorComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonToggleModule,
    StoreModule
  ],
  exports: [
    CommonModule,
    ComponentPropertyEditorComponent,
    MatInputModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonToggleModule]
})
export class ComponentPropertyEditorModule {
  static forRoot(): ModuleWithProviders<ComponentPropertyEditorModule> {
    return {
      ngModule: ComponentPropertyEditorModule,
      providers: [
        { provide: LatafiInjectableService, useExisting: ComponentPropertyEditorService, multi: true }]
    };
  }
}
