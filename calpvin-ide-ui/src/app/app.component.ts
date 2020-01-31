import { Component, ViewChild, OnInit, ElementRef, HostListener } from '@angular/core';
import { EventManager, EventType, VirtualFileType, VirtualFile, IdeEvent } from 'calpvin-ide-shared/IdeCommand';
import { VirtualFileTree } from 'src/app.lib/virtual-tree/virtual-tree';

@Component({
  selector: 'cide-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private virtualFileTree: VirtualFileTree, private _el: ElementRef<HTMLElement>) {

  }

  public static EventManager: EventManager;
  title = 'calpvin-ide';

  @ViewChild('ide', { read: ElementRef, static: true }) _ide: ElementRef<HTMLElement>;

  async ngOnInit() {
    AppComponent.EventManager = new EventManager(window, (this._ide.nativeElement as any).contentWindow, this.messageEventListener);
  }

  private messageEventListener = async (e: MessageEvent) => {
    console.log('Main: ', e);

    if ((e.data as IdeEvent).eventType === EventType.IdeStartEvent) {
      const res = await AppComponent.EventManager.sendEvent<VirtualFile>(
        {
          eventType: EventType.ReadComponentFile,
          uniqueIdentifier: EventManager.generateUniqueIdentifire(),
          data: new VirtualFile(VirtualFileType.ComponentHtml, 'test-component')
        });

      const file = this.virtualFileTree.addFile(res.data);
    }

    if ((e.data as IdeEvent).eventType === EventType.AppHideIde) {
      this.hideIde();
    }
  }

  async onCideComponentClick(event: MouseEvent) {

  }

  private hideIde() {
    this._ide.nativeElement.style.display = 'none';
    window.focus();
  }

  private showIde() {
    this._ide.nativeElement.style.display = 'block';
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'q') {
      this._ide.nativeElement.style.display === 'block' ? this.hideIde() : this.showIde();
    }
  }
}
