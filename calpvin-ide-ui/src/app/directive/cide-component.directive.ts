import { Directive, Renderer2, ElementRef, Input, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import { HtmlParser, Element } from '@angular/compiler';
import { VirtualFileTree } from 'src/app.lib/virtual-tree/virtual-tree';
import { findElement } from 'src/app.lib/extension/angular-html-elements.extension';
import { VirtualFileType, EventManager, EventType, VirtualFile } from 'calpvin-ide-shared/IdeCommand';
import { AppComponent } from '../app.component';

@Directive({
  selector: '[cideComponent]'
})
export class CideComponentDirective implements OnInit {
  public static readonly ComponentCssClass = 'cide-component';
  public static readonly ComponentUniqueCssClass = 'cide-unique';

  constructor(
    private renderer: Renderer2,
    private hostElement: ElementRef<HTMLElement>,
    private virtualTree: VirtualFileTree) {

    renderer.addClass(hostElement.nativeElement, CideComponentDirective.ComponentCssClass);

    hostElement.nativeElement.addEventListener('click', this.onClick);
  }

  @Input() baseComponentTagName: string;

  ngOnInit(): void {
    if (!this.baseComponentTagName) {
      console.log('Base Component name not set!!');
    }
  }

  private onClick = async (event: MouseEvent) => {
    if (event.ctrlKey) {
      const parser = new HtmlParser();

      const componentName = VirtualFileTree.getComponentName(this.baseComponentTagName);
      const file = this.virtualTree.getFile(componentName, VirtualFileType.ComponentHtml);

      const parsedTreeResult = parser.parse(file.content, 'fake_url');

      let uniqueClassName: string = null;
      (event.target as HTMLElement).classList.forEach(element => {
        if (element.startsWith(CideComponentDirective.ComponentUniqueCssClass + '-')) { uniqueClassName = element; }
      });

      const findNode = findElement(parsedTreeResult.rootNodes.map(x => x as Element), uniqueClassName);

      file.content = file.content.substr(0, findNode.startSourceSpan.start.offset)
        + file.content.substr(findNode.endSourceSpan.end.offset, file.content.length);

      const res = await AppComponent.EventManager.sendEvent<VirtualFile>(
        {
          eventType: EventType.WriteComponentFile,
          uniqueIdentifier: EventManager.generateUniqueIdentifire(),
          data: new VirtualFile(VirtualFileType.ComponentHtml, componentName, file.content)
        }, false);
    }
  }
}
