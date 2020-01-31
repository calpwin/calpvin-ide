import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DelComponentComponent } from './del-component/del-component.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [DelComponentComponent],
  imports: [
    BrowserModule,
    CommonModule
  ],
  exports: [
    DelComponentComponent
  ],
  bootstrap: [DelComponentComponent]
})
export class TestModuleModule { }
