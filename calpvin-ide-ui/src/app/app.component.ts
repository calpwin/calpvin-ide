import { Component, ViewChild, OnInit, ElementRef, HostListener } from '@angular/core';
import { HtmlParser, Element } from '@angular/compiler';
import { findElement } from '../app.lib/extension/angular-html-elements.extension';
import { ComponentFileStructure, ComponentFile } from 'src/app.lib/component/component-file-structure';
import { EventManager, CommandType } from 'lib/calpvin-ide-shared/IdeCommand';

@Component({
  selector: 'cide-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'calpvin-ide';

  @ViewChild('ide', { read: ElementRef, static: true }) _ide: ElementRef;

  private readonly _componentFileStructure: ComponentFileStructure = new ComponentFileStructure();
  private _eventManager: EventManager;

  async ngOnInit() {
    this._eventManager = new EventManager(window, this._ide.nativeElement.contentWindow, (e) => { this.messageEventListener(e); });

    setTimeout(async () => {
      // const res = await eventManager.sendEvent(
      //   {
      //     commandType: CommandType.ReadFile,
      //     uniqueIdentifier: EventManager.generateUniqueIdentifire(),
      //     data: 'Yooolo'
      //   });

      const res = {
        data: `<div class="cide-component-container" cdkDropList>
      <div class="cide-component"></div>
    </div>

    <cide-wysiwyg-ui-editor></cide-wysiwyg-ui-editor>

    <iframe #ide class="ide-wrapper" src="http://localhost:3000"></iframe>
    `};

      this._componentFileStructure.htmlTemplate.content = res.data;

      // this.parseHtml(res.data);
    }, 1000);
  }

  private messageEventListener(e: MessageEvent) {
    console.log('Main: ', e);
  }

  private parseHtml(html: string) {

    const parser = new HtmlParser();
    const parsedTreeResult = parser.parse(html, 'fake_url');

    const findNode = findElement(parsedTreeResult.rootNodes.map(x => x as Element), 'cide-component');

    console.log(findNode);
  }

  async onCideComponentClick(event: MouseEvent) {
    if (event.ctrlKey) {
      const parser = new HtmlParser();
      const parsedTreeResult = parser.parse(this._componentFileStructure.htmlTemplate.content, 'fake_url');

      let className: string = null;
      (event.target as HTMLElement).classList.forEach(element => {
        if (element.startsWith('cide-component')) { className = element; }
      });

      const findNode = findElement(parsedTreeResult.rootNodes.map(x => x as Element), className);

      let content = this._componentFileStructure.htmlTemplate.content;

      content = content.substr(0, findNode.startSourceSpan.start.offset)
        + content.substr(findNode.endSourceSpan.end.offset, content.length);

      const res = await this._eventManager.sendEvent(
        {
          commandType: CommandType.WriteFile,
          uniqueIdentifier: EventManager.generateUniqueIdentifire(),
          data: content
        }, false);
    }
  }
}
