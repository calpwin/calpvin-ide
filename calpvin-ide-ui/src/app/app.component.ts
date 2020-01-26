import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'cide-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'calpvin-ide';

  @ViewChild('ide', { read: ElementRef, static: true }) _ide: ElementRef;

  ngOnInit(): void {
    // setInterval(() => {
    //   (this._ide.nativeElement.contentWindow as Window).postMessage(document, '*');
    // }, 2000);

    window.addEventListener('message', (e: MessageEvent) => {
      console.log('Receive from ide: ', e.data);
    });
  }
}
