import { NgModuleRef, ApplicationRef } from '@angular/core';
import { createNewHosts } from '@angularclass/hmr';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

export const hmrBootstrap = async (module: any, bootstrap: () => Promise<NgModuleRef<any>>) => {
  module.hot.accept();

  let devModule: NgModuleRef<any> = null;

  if (!(window as any).NgModule) {
    bootstrap().then(async mod => {
      (window as any).NgModule = mod;
    });
  }

  const newNode = document.createElement('cide-del-component');
  document.getElementsByTagName('cide-root')[0].insertAdjacentElement('beforeend', newNode);

  const newAppModule = require('./app/test-module/test-module.module').TestModuleModule;
  devModule = await platformBrowserDynamic().bootstrapModule(newAppModule);


  module.hot.dispose(() => {
    devModule.destroy();
    // const appRef: ApplicationRef = devModule.injector.get(ApplicationRef);
    // const elements = appRef.components.map(c => c.location.nativeElement);
    // const makeVisible = createNewHosts(elements);
    // ngModule.destroy();
    // makeVisible();
  });
};
