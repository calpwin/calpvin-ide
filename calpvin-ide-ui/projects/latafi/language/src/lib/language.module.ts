import { NgModule } from '@angular/core';
import { LanguageComponent } from './language.component';
import { IfStatementComponent } from './nodes/if-statement/if-statement.component';
import { CommonModule } from '@angular/common';
import { BlockComponent } from './nodes/block/block.component';
import { PropertyAccessExpressionComponent } from './nodes/property-access-expression/property-access-expression.component';
import { NodePlaceComponent } from './nodes/node-place.component';



@NgModule({
  declarations: [
    LanguageComponent,
    IfStatementComponent,
    BlockComponent,
    PropertyAccessExpressionComponent,
    NodePlaceComponent],
  imports: [
    CommonModule
  ],
  exports: [
    LanguageComponent,
    IfStatementComponent,
    BlockComponent,
    PropertyAccessExpressionComponent,
    NodePlaceComponent]
})
export class LanguageModule { }
