import { Component, OnInit, Inject } from '@angular/core';
import { DragDrop } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'cide-wysiwyg-ui-editor',
  templateUrl: './wysiwyg-ui-editor.component.html',
  styleUrls: ['./wysiwyg-ui-editor.component.scss']
})
export class WysiwygUiEditorComponent implements OnInit {

  constructor(
    @Inject(DragDrop) private dragDrop: DragDrop,
    @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    const els = this.document.getElementsByClassName('cide-component');

    this.dragDrop.createDrag(els[0] as HTMLElement);
  }

}
