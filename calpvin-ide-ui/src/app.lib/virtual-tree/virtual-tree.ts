import { Injectable } from '@angular/core';
import { VirtualFileType, VirtualFile, EventType, EventManager } from 'calpvin-ide-shared/IdeCommand';
import { AppComponent } from 'src/app/app.component';

@Injectable({
  providedIn: 'root',
})
export class VirtualFileTree {
  private readonly _virtualFiles: VirtualFile[] = [];

  static getComponentName(byTagName: string) {
    return byTagName.replace('cide-', '');
  }

  addFile(file: VirtualFile): VirtualFile {
    this._virtualFiles.push(file);

    return file;
  }

  getFile(componentName: string, fileName: string): VirtualFile {
    return this._virtualFiles.find(x => x.componentName === componentName && x.fileName === fileName);
  }

  async addComponentFiles(componentName: string): Promise<VirtualFile[]> {
    const htmlFileRes = await AppComponent.EventManager.sendEvent<VirtualFile>(
      {
        eventType: EventType.ReadComponentFile,
        uniqueIdentifier: EventManager.generateUniqueIdentifire(),
        data: new VirtualFile(VirtualFileType.ComponentHtml, componentName, `${componentName}.component.html`)
      });

    const cssFileRes = await AppComponent.EventManager.sendEvent<VirtualFile>(
      {
        eventType: EventType.ReadComponentFile,
        uniqueIdentifier: EventManager.generateUniqueIdentifire(),
        data: new VirtualFile(VirtualFileType.ComponentHtml, componentName, `${componentName}.component.scss`)
      });

    this.addFile(htmlFileRes.data);
    this.addFile(cssFileRes.data);

    return [htmlFileRes.data, cssFileRes.data];
  }
}
