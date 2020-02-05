import { NgModuleRef, ApplicationRef } from '@angular/core';
import { createNewHosts } from '@angularclass/hmr';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

export const hmrBootstrap = async (module: any, bootstrap: () => Promise<NgModuleRef<any>>) => {
  module.hot.accept();

  let devModule: NgModuleRef<any> = null;

  const newAppModule = require('./app/test-module/test-module.module').TestModuleModule;
  const newNode = document.createElement('cide-test-component');

  if (!(window as any).NgModule) {
    bootstrap().then(async mod => {
      (window as any).NgModule = mod;

      document.getElementsByTagName('cide-wysiwyg-ui-editor')[0].insertAdjacentElement('beforeend', newNode);

      devModule = await platformBrowserDynamic().bootstrapModule(newAppModule);
    });
  }

  const el = document.getElementsByTagName('cide-wysiwyg-ui-editor')[0];

  if (el) {
    el.insertAdjacentElement('beforeend', newNode);

    devModule = await platformBrowserDynamic().bootstrapModule(newAppModule);
  }

  module.hot.dispose(() => {
    devModule.destroy();
    // const appRef: ApplicationRef = devModule.injector.get(ApplicationRef);
    // const elements = appRef.components.map(c => c.location.nativeElement);
    // const makeVisible = createNewHosts(elements);
    // ngModule.destroy();
    // makeVisible();
  });
};
