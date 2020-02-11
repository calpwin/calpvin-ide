import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IdeComponent } from './ide/ide.component';
import { IdeUiLibModule } from 'projects/ide-ui-lib/src/public-api';
import { ComponentVisualEditorModule } from 'projects/plankio/component-visual-editor/src/public-api';
import { ComponentPropertyEditorModule } from 'projects/plankio/component-property-editor/src/public-api';

@NgModule({
  declarations: [
    AppComponent,
    IdeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    IdeUiLibModule.forRoot(),
    ComponentVisualEditorModule.forRoot(),
    ComponentPropertyEditorModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
