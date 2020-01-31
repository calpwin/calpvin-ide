import { Injectable } from '@angular/core';
import { VirtualFileType, VirtualFile } from 'calpvin-ide-shared/IdeCommand';

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

  getFile(componentName: string, fileType: VirtualFileType): VirtualFile | undefined {
    return this._virtualFiles.find(x => x.componentName === componentName && x.fileType === fileType);
  }
}
