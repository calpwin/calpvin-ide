import { Component, ViewChild, OnInit, ElementRef, HostListener, PlatformRef, ApplicationRef, Injector, } from '@angular/core';
import { EventType, IdeEvent, Workspace } from 'calpvin-ide-shared/IdeCommand';
import { EventManagerService } from '@latafi/core/src/lib/services/event-manager.service';
import { VirtualFileTreeService } from '@latafi/core/src/lib/services/virtual-tree.service';
import { WorkspaceService } from '@latafi/core/src/lib/services/workspace.service';
import { ILatafiExtension } from '@latafi/core/src/lib/services/i-extenson.service';
import Split from 'split.js';

@Component({
  selector: 'cide-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private virtualFileTree: VirtualFileTreeService,
    private _workspaceService: WorkspaceService,
    private _el: ElementRef<HTMLElement>,
    private _eventManagerService: EventManagerService,
    private readonly _injector: Injector) {
    this.constractExtensions();
  }

  title = 'calpvin-ide';

  @ViewChild('ide', { read: ElementRef, static: true }) _ide: ElementRef<HTMLElement>;
  @ViewChild('ideEditor', { read: ElementRef, static: true }) _ideEditor: ElementRef<HTMLElement>;

  async ngOnInit() {
    this._eventManagerService.init(
      window,
      (this._ide.nativeElement.querySelector('iframe') as any).contentWindow,
      this.messageEventListener);

    this.initExtensions();

    this.enablePanelSplit();
  }

  private _splitPanels;
  private enablePanelSplit() {
    this._splitPanels = Split([this._ideEditor.nativeElement, this._ide.nativeElement], {
      direction: 'vertical',
      sizes: [50, 50],
      gutterSize: 15
    });
  }

  private initExtensions() {
    const exts = this._injector.get(ILatafiExtension) as unknown as ILatafiExtension[];

    exts.forEach(ext => {
      ext.onAppInit();
    });
  }

  private constractExtensions() {
    const exts = this._injector.get(ILatafiExtension) as unknown as ILatafiExtension[];

    exts.forEach(ext => {
      ext.onBaseAppConstruct();
    });
  }

  private messageEventListener = async (e: MessageEvent) => {
    // console.log('Main: ', e);

    const command = (e.data as IdeEvent<any>);

    if (command.eventType === EventType.IdeStartEvent) {
      await this.virtualFileTree.addComponentFiles('test-component');
    } else if (command.eventType === EventType.AppHideIde) {
      this.hideIde();
    } else if (command.eventType === EventType.SetWorkspace) {
      this._workspaceService.activeWorkspace = command.data as Workspace;
    }
  }

  async onCideComponentClick(event: MouseEvent) {

  }

  private hideIde() {
    this._ide.nativeElement.style.display = 'none';
    window.focus();
  }

  private async showIde() {
    this._ide.nativeElement.style.display = 'block';
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.altKey && event.key === 'q') {
      this._ide.nativeElement.style.display === 'block' ? this.hideIde() : this.showIde();
    } else if (event.altKey && event.key === 's') {
      this.virtualFileTree.saveAsync();
    }
  }
}
