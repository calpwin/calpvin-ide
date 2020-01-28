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
      const res = await eventManager.sendEvent(
        {
          commandType: CommandType.ReadFile,
          uniqueIdentifier: EventManager.generateUniqueIdentifire(),
          data: 'Yooolo'
        });

      this.parseHtml(res.data);
    }, 5000);
  }

  private messageEventListener(e: MessageEvent) {
    console.log('Main: ', e);
  }

  private parseHtml(html: string) {


  }
}
