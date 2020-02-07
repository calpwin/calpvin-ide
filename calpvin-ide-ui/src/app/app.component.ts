import { Component, ViewChild, OnInit, ElementRef, HostListener } from '@angular/core';
import { EventType, IdeEvent, Workspace } from 'calpvin-ide-shared/IdeCommand';
import { EventManagerService } from 'projects/ide-ui-lib/src/lib/services/event-manager.service';
import { VirtualFileTreeService } from 'projects/ide-ui-lib/src/lib/services/virtual-tree.service';
import { WorkspaceService } from 'projects/ide-ui-lib/src/lib/services/workspace.service';

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
    private _eventManagerService: EventManagerService) {

  }

  title = 'calpvin-ide';

  @ViewChild('ide', { read: ElementRef, static: true }) _ide: ElementRef<HTMLElement>;

  async ngOnInit() {
    this._eventManagerService.init(window, (this._ide.nativeElement as any).contentWindow, this.messageEventListener);
  }

  private messageEventListener = async (e: MessageEvent) => {
    console.log('Main: ', e);

    const command = (e.data as IdeEvent<any>);

    if (command.eventType === EventType.IdeStartEvent) {
      await this.virtualFileTree.addComponentFiles('test-component');

      setInterval(() => {
        // this._workspaceService.activeComponent = '';
      }, 3000);
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
    }
  }
}
