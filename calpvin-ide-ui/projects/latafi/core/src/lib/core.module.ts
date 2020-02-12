import { NgModule, ModuleWithProviders } from '@angular/core';
import { EventManagerService } from './services/event-manager.service';
import { VirtualFileTreeService } from './services/virtual-tree.service';
import { DevModuleManagerService } from './services/dev-module-manager.service';
import { WorkspaceService } from './services/workspace.service';

@NgModule({
  declarations: [],
  imports: [
  ],
  exports: []
})
export class LatafiCoreModule {
  static forRoot(): ModuleWithProviders<LatafiCoreModule> {
    return {
      ngModule: LatafiCoreModule,
      providers: [
        EventManagerService,
        VirtualFileTreeService,
        DevModuleManagerService,
        WorkspaceService]
    };
  }
}
