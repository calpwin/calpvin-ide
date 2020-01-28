import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { EventManager, CommandType } from 'calpvin-ide-shared';

@Component({
  selector: 'cide-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'calpvin-ide';

  @ViewChild('ide', { read: ElementRef, static: true }) _ide: ElementRef;

  async ngOnInit() {
    const eventManager = new EventManager(window, this._ide.nativeElement.contentWindow, (e) => { this.messageEventListener(e); });

    setTimeout(async () => {
      const resp = await eventManager.sendEvent(
        {
          commandType: CommandType.ReadFile,
          uniqueIdentifier: EventManager.generateUniqueIdentifire(),
          data: 'Yooolo'
        });

      console.log('Get Response: ', resp);
    }, 5000);



    // window.postMessage({
    //   commandType: CommandType.ReadFile,
    //   uniqueIdentifier: EventManager.generateUniqueIdentifire(),
    //   data: 'Yooolo'
    // }, 'http://localhost:3000');

    // this._ide.nativeElement.contentWindow.postMessage('ffdfdfd', '*');
  }

  private messageEventListener(e: MessageEvent) {
    console.log('Main: ', e);
  }
}
