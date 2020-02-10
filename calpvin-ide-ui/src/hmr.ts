import { NgModuleRef, ApplicationRef } from '@angular/core';
import { createNewHosts } from '@angularclass/hmr';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { DevModuleManagerService } from 'projects/ide-ui-lib/src/lib/services/dev-module-manager.service';

export const hmrBootstrap = async (module: any, bootstrap: () => Promise<NgModuleRef<any>>) => {
  module.hot.accept();

  let devModuleRef: NgModuleRef<any> = null;

  const devModule = require('./app/test-module/test-module.module').TestModuleModule;
  const devModuleNode = document.createElement('cide-test-component');
  let mainModule = (window as any).NgModule as NgModuleRef<AppModule>;

  if (!mainModule) {
    bootstrap().then(async mod => {
      (window as any).NgModule = mod;
      mainModule = mod as NgModuleRef<AppModule>;

      document.getElementsByTagName('cide-wysiwyg-ui-editor')[0].insertAdjacentElement('beforeend', devModuleNode);

      // devModuleRef = await platformBrowserDynamic().bootstrapModule(devModule);

      // const devModuleManagerService = mainModule.injector.get(DevModuleManagerService);
      // devModuleManagerService.applyCideComponentDirective();
    });
  }

  const el = document.getElementsByTagName('cide-wysiwyg-ui-editor')[0];

  if (el) {
    el.insertAdjacentElement('beforeend', devModuleNode);

    // devModuleRef = await platformBrowserDynamic().bootstrapModule(devModule);

    // const devModuleManagerService = mainModule.injector.get(DevModuleManagerService);
    // await devModuleManagerService.updateVirtualTreeAsync();
    // devModuleManagerService.applyCideComponentDirective();
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
