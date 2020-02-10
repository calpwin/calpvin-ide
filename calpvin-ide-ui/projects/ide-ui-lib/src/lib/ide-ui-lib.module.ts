import { NgModule, ModuleWithProviders } from '@angular/core';
import { CideComponentDirective } from './directive/cide-component.directive';
import { EventManagerService } from './services/event-manager.service';
import { VirtualFileTreeService } from './services/virtual-tree.service';
import { DevModuleManagerService } from './services/dev-module-manager.service';
import { WorkspaceService } from './services/workspace.service';
import { CideCPropertyEditorComponent } from './components/cide-c-property-editor/cide-c-property-editor.component';



@NgModule({
  declarations: [
    CideComponentDirective,
    CideCPropertyEditorComponent],
  imports: [
  ],
  exports: [CideComponentDirective, CideCPropertyEditorComponent]
})
export class IdeUiLibModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IdeUiLibModule,
      providers: [
        EventManagerService,
        VirtualFileTreeService,
        DevModuleManagerService,
        WorkspaceService]
    };
  }
}
