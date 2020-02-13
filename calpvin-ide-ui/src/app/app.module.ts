import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IdeComponent } from './ide/ide.component';
import { LatafiCoreModule } from '@latafi/core/src/lib/core.module';
import { ComponentVisualEditorModule } from '@latafi/component-visual-editor/src/lib/component-visual-editor.module';
import { ComponentPropertyEditorModule } from '@latafi/component-property-editor/src/lib/component-property-editor.module';

@NgModule({
  declarations: [
    AppComponent,
    IdeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    BrowserAnimationsModule,
    LatafiCoreModule.forRoot(),
    ComponentVisualEditorModule.forRoot(),
    ComponentPropertyEditorModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
