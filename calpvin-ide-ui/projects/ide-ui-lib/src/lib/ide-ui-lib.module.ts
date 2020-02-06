import { NgModule, ModuleWithProviders } from '@angular/core';
import { CideComponentDirective } from './directive/cide-component.directive';
import { EventManagerService } from './services/event-manager.service';
import { VirtualFileTreeService } from './services/virtual-tree';
import { DevModuleManagerService } from './services/dev-module-manager.service';



@NgModule({
  declarations: [
    CideComponentDirective],
  imports: [
  ],
  exports: [CideComponentDirective]
})
export class IdeUiLibModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IdeUiLibModule,
      providers: [EventManagerService, VirtualFileTreeService, DevModuleManagerService]
    };
  }
}
