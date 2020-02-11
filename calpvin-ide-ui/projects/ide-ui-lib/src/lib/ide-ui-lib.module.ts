import { NgModule, ModuleWithProviders } from '@angular/core';
import { CideComponentDirective } from './directive/cide-component.directive';
import { EventManagerService } from './services/event-manager.service';
import { VirtualFileTreeService } from './services/virtual-tree.service';
import { DevModuleManagerService } from './services/dev-module-manager.service';
import { WorkspaceService } from './services/workspace.service';
import { CideCPropertyEditorComponent } from './components/cide-c-property-editor/cide-c-property-editor.component';
import { ComponentVisualEditorModule } from 'projects/plankio/component-visual-editor/src/public-api';



@NgModule({
  declarations: [
    CideComponentDirective,
    CideCPropertyEditorComponent],
  imports: [
    ComponentVisualEditorModule.forRoot()
  ],
  exports: [CideComponentDirective, CideCPropertyEditorComponent]
})
export class IdeUiLibModule {
  static forRoot(): ModuleWithProviders<IdeUiLibModule> {
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
