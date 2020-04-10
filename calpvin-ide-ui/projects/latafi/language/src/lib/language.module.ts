import { NgModule } from '@angular/core';
import { LanguageComponent } from './language.component';
import { IfStatementComponent } from './nodes/if-statement/if-statement.component';



@NgModule({
  declarations: [LanguageComponent, IfStatementComponent],
  imports: [
  ],
  exports: [LanguageComponent, IfStatementComponent]
})
export class LanguageModule { }
