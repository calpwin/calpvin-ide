import { Injectable } from '@angular/core';
import { VirtualFileType, VirtualFile, EventType, EventManager } from 'calpvin-ide-shared/IdeCommand';
import { HtmlParser } from '@angular/compiler';
import * as csstree from 'css-tree';
import { EventManagerService } from './event-manager.service';

@Injectable({
  providedIn: 'platform'
})
export class VirtualFileTreeService {
  private readonly _virtualFiles: VirtualFile[] = [];
  private readonly _htmlParser: HtmlParser = new HtmlParser();

  static getComponentName(byTagName: string) {
    return byTagName.replace('cide-', '');
  }

  constructor(private readonly eventManagerService: EventManagerService) {
  }

  addFile(file: VirtualFile): VirtualFile {
    const findFile = this.getFile(file.componentName, file.fileName, file.fileType);

    if (!findFile) {
      this._virtualFiles.push(file);
      this.tryUpdateFileAst(file);
    } else {
      findFile.content = file.content;
      this.tryUpdateFileAst(findFile);
    }

    return file;
  }

  private tryUpdateFileAst(file: VirtualFile): boolean {
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

  getFile(componentName: string, fileName: string, fileType?: VirtualFileType): VirtualFile {
    const file = this._virtualFiles.find(x => x.componentName === componentName && x.fileName === fileName);

    return file && fileType ? (file.fileType === fileType ? file : undefined) : file;
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
