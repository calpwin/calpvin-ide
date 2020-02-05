import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WysiwygUiEditorComponent } from './wysiwyg-ui-editor/wysiwyg-ui-editor.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CideComponentDirective } from './directive/cide-component.directive';
import { IdeComponent } from './ide/ide.component';

@NgModule({
  declarations: [
    AppComponent,
    WysiwygUiEditorComponent,
    CideComponentDirective,
    IdeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
