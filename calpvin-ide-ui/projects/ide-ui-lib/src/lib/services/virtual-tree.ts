import { Injectable } from '@angular/core';
import { VirtualFileType, VirtualFile, EventType, EventManager } from 'calpvin-ide-shared/IdeCommand';
import { HtmlParser } from '@angular/compiler';
import * as csstree from 'css-tree';
import { EventManagerService } from './event-manager.service';

@Injectable()
export class VirtualFileTreeService {
  private readonly _virtualFiles: VirtualFile[] = [];
  private readonly _htmlParser: HtmlParser = new HtmlParser();

  static getComponentName(byTagName: string) {
    return byTagName.replace('cide-', '');
  }

  constructor(private readonly eventManagerService: EventManagerService) {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!! Create Ioc!!!');
  }

  addFile(file: VirtualFile): VirtualFile {
    this._virtualFiles.push(file);

    this.trySetFileAst(file);

    return file;
  }

  private trySetFileAst(file: VirtualFile) {
    if (file.astTree) {
      return true;
    }

    if (file.fileType === VirtualFileType.ComponentHtml) {
      file.astTree = this._htmlParser.parse(file.content, file.fileName);

      return true;
    }

    if (file.fileType === VirtualFileType.ComponentCss) {
      file.astTree = csstree.parse(file.content, { positions: true });

      return true;
    }

    return false;
  }

  getFile(componentName: string, fileName: string): VirtualFile {
    return this._virtualFiles.find(x => x.componentName === componentName && x.fileName === fileName);
  }

  async addComponentFiles(componentName: string): Promise<VirtualFile[]> {
    const htmlFileRes = await this.eventManagerService.EventManager.sendEvent<VirtualFile>(
      {
        eventType: EventType.ReadComponentFile,
        uniqueIdentifier: EventManager.generateUniqueIdentifire(),
        data: new VirtualFile(VirtualFileType.ComponentHtml, componentName, `${componentName}.component.html`)
      });

    const cssFileRes = await this.eventManagerService.EventManager.sendEvent<VirtualFile>(
      {
        eventType: EventType.ReadComponentFile,
        uniqueIdentifier: EventManager.generateUniqueIdentifire(),
        data: new VirtualFile(VirtualFileType.ComponentCss, componentName, `${componentName}.component.scss`)
      });

    this.addFile(htmlFileRes.data);
    this.addFile(cssFileRes.data);

    return [htmlFileRes.data, cssFileRes.data];
  }
}
