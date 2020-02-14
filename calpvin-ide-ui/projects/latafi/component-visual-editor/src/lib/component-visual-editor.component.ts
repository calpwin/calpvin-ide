import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewContainerRef, ChangeDetectorRef, Renderer2, Inject } from '@angular/core';
import { ComponentVisualEditorService } from './component-visual-editor.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'latafi-component-visual-editor',
  templateUrl: 'component-visual-editor.component.html',
  styleUrls: ['component-visual-editor.component.scss']
})
export class ComponentVisualEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('componentPropertyWrapper', { read: ViewContainerRef }) componentPropertyWrapper: ViewContainerRef;

  constructor(
    private readonly _componentVisualEditorService: ComponentVisualEditorService,
    private readonly _changeDedectionRef: ChangeDetectorRef,
    private readonly _renderer2: Renderer2,
    @Inject(DOCUMENT) private readonly _document: Document) { }

  ngOnInit(): void {
    this._componentVisualEditorService.onSelectElement.subscribe(this.onSelectelement);
    this._componentVisualEditorService.wrapperElement = this._document.querySelector('.cide-unique-component-container');
  }

  ngAfterViewInit(): void {
    this._componentVisualEditorService.onPropertyEditorWrapperInit.emit(this.componentPropertyWrapper);
    this._changeDedectionRef.detectChanges();
  }

  onSelectelement = (el: ElementRef<HTMLElement>) => {
    if (el) {
      this._renderer2.setStyle(el.nativeElement, 'border-bottom', '3px solid #333');
    }

    if (this._componentVisualEditorService.previousSelectedElement) {
      this._renderer2.setStyle(this._componentVisualEditorService.previousSelectedElement.nativeElement, 'border-bottom', '0');
    }
  }

  onCanvaClick(event: MouseEvent) {
    this._componentVisualEditorService.selectedElement = undefined;
  }
}
