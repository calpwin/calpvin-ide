import { Component, ViewChild, OnInit, ElementRef, HostListener } from '@angular/core';
import { EventManager, EventType, VirtualFileType, VirtualFile, IdeEvent, SetWorkspaceCommandData } from 'calpvin-ide-shared/IdeCommand';
import { VirtualFileTree } from 'src/app.lib/virtual-tree/virtual-tree';
import * as csstree from 'css-tree';

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
      await this.virtualFileTree.addComponentFiles('test-component');

      const cssFile = this.virtualFileTree.getFile('test-component', 'test-component.component.scss');
      const cssAst = csstree.parse(cssFile.content, {
        positions: true
      });

      csstree.walk(cssAst, (node) => {
        if (node.type === 'ClassSelector') {
          console.log('NOde: ', node);
        }
      });

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
    await AppComponent.EventManager.sendEvent<SetWorkspaceCommandData>(
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
