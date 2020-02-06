import { Component, ViewChild, OnInit, ElementRef, HostListener } from '@angular/core';
import { EventManager, EventType, IdeEvent, SetWorkspaceCommandData } from 'calpvin-ide-shared/IdeCommand';
import { EventManagerService } from 'projects/ide-ui-lib/src/lib/services/event-manager.service';
import { VirtualFileTreeService } from 'projects/ide-ui-lib/src/lib/services/virtual-tree';

@Component({
  selector: 'cide-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private virtualFileTree: VirtualFileTreeService,
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

    if ((e.data as IdeEvent).eventType === EventType.IdeStartEvent) {
      await this.virtualFileTree.addComponentFiles('test-component');
    } else if ((e.data as IdeEvent).eventType === EventType.AppHideIde) {
      this.hideIde();
    }
  }

  async onCideComponentClick(event: MouseEvent) {

  }

  private hideIde() {
    this._ide.nativeElement.style.display = 'none';
    window.focus();
  }

  private async showIde() {
    await this._eventManagerService.EventManager.sendEvent<SetWorkspaceCommandData>(
      {
        eventType: EventType.IdeSetWorkspace,
        uniqueIdentifier: EventManager.generateUniqueIdentifire(),
        data: new SetWorkspaceCommandData(['/home/project/calpvin-ide-ui/src/app'])
      }, false);

    this._ide.nativeElement.style.display = 'block';
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'q') {
      this._ide.nativeElement.style.display === 'block' ? this.hideIde() : this.showIde();
    }
  }
}
