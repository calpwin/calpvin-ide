import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WysiwygUiEditorComponent } from './wysiwyg-ui-editor/wysiwyg-ui-editor.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IdeComponent } from './ide/ide.component';
import { IdeUiLibModule } from 'projects/ide-ui-lib/src/public-api';

@NgModule({
  declarations: [
    AppComponent,
    WysiwygUiEditorComponent,
    IdeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    IdeUiLibModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
