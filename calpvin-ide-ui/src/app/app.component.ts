import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { EventManager, EventType, VirtualFileType, VirtualFile, IdeEvent } from 'calpvin-ide-shared/IdeCommand';
import { VirtualFileTree } from 'src/app.lib/virtual-tree/virtual-tree';

@Component({
  selector: 'cide-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private virtualFileTree: VirtualFileTree) {

  }

  public static EventManager: EventManager;
  title = 'calpvin-ide';

  @ViewChild('ide', { read: ElementRef, static: true }) _ide: ElementRef;

  async ngOnInit() {
    AppComponent.EventManager = new EventManager(window, this._ide.nativeElement.contentWindow, this.messageEventListener);

    console.log(AppComponent.EventManager);

    // setTimeout(async () => {
    //   console.log('Send to IDE');


    //   const res = await this._eventManager.sendEvent(
    //     {
    //       eventType: EventType.ReadComponentFile,
    //       uniqueIdentifier: EventManager.generateUniqueIdentifire(),
    //       data: 'Yooolo'
    //     });

    //   const file = this.virtualFileTree.addFile(new VirtualFile(res.data, VirtualFileType.ComponentHtml, 'test-component'));

    //   console.log('Add file: ', file);
    // }, 9000);
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
  }

  async onCideComponentClick(event: MouseEvent) {

  }
}
