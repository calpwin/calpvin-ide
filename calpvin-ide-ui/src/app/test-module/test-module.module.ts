import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponentComponent } from './test-component/test-component.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppModule } from '../app.module';

@NgModule({
  declarations: [
    TestComponentComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppModule
  ],
  exports: [
    TestComponentComponent
  ],
  bootstrap: [TestComponentComponent]
})
export class TestModuleModule { }
