import { NgModuleRef, PlatformRef } from '@angular/core';
import { AppModule } from './app/app.module';
import { DevModuleManagerService } from '@latafi/core/src/lib/services/dev-module-manager.service';
import { ComponentVisualEditorService } from '@latafi/component-visual-editor';

export const hmrBootstrap = async (module: any, bootstrap: () => Promise<NgModuleRef<any>>) => {
  module.hot.accept();

  let devModuleRef: NgModuleRef<any> = null;

  const devModule = require('./app/test-module/test-module.module').TestModuleModule;
  const devModuleNode = document.createElement('cide-test-component');
  let mainModule = (window as any).NgModule as NgModuleRef<AppModule>;
  let platformRef = (window as any).PlatformRef as PlatformRef;

  if (!mainModule) {
    bootstrap().then(async mod => {
      (window as any).NgModule = mod;
      mainModule = mod as NgModuleRef<AppModule>;
      (window as any).PlatformRef = mainModule.injector.get(PlatformRef);
      platformRef = (window as any).PlatformRef as PlatformRef;

      document.getElementsByClassName('component-canva-wrapper')[0].insertAdjacentElement('beforeend', devModuleNode);

      devModuleRef = await platformRef.bootstrapModule(devModule);

      const devModuleManagerService = mainModule.injector.get(DevModuleManagerService);
      devModuleManagerService.setComponentWrapperElement();

      const componentVisualEditorService = mainModule.injector.get(ComponentVisualEditorService);
      // componentVisualEditorService.updateLatafiComponentDirective();
    });
  } else {
    const el = document.getElementsByClassName('component-canva-wrapper')[0];

    if (el) {
      el.insertAdjacentElement('beforeend', devModuleNode);

      devModuleRef = await platformRef.bootstrapModule(devModule);

      const devModuleManagerService = mainModule.injector.get(DevModuleManagerService);
      await devModuleManagerService.updateVirtualTreeAsync();
      devModuleManagerService.setComponentWrapperElement();

      const componentVisualEditorService = mainModule.injector.get(ComponentVisualEditorService);
      // componentVisualEditorService.updateLatafiComponentDirective();
    }
  }

  module.hot.dispose(() => {
    devModuleRef.destroy();
    // const appRef: ApplicationRef = devModule.injector.get(ApplicationRef);
    // const elements = appRef.components.map(c => c.location.nativeElement);
    // const makeVisible = createNewHosts(elements);
    // ngModule.destroy();
    // makeVisible();
  });
};
