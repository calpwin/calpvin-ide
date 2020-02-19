import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewContainerRef, ChangeDetectorRef, Renderer2, Inject } from '@angular/core';
import { ComponentVisualEditorService } from './component-visual-editor.service';
import { DOCUMENT } from '@angular/common';
import Split from 'split.js';

@Component({
  selector: 'latafi-component-visual-editor',
  templateUrl: 'component-visual-editor.component.html',
  styleUrls: ['component-visual-editor.component.scss']
})
export class ComponentVisualEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('componentPropertyContainer', { read: ViewContainerRef }) componentPropertyContainer: ViewContainerRef;
  @ViewChild('componentPropertyWrapper') componentPropertyWrapper: ElementRef;
  @ViewChild('componentCanvaEditorWrapper') componentCanvaEditorWrapper: ElementRef;

  constructor(
    private readonly _componentVisualEditorService: ComponentVisualEditorService,
    private readonly _changeDedectionRef: ChangeDetectorRef,
    private readonly _renderer2: Renderer2,
    @Inject(DOCUMENT) private readonly _document: Document,
    public readonly elementRef: ElementRef<HTMLElement>) { }


  ngOnInit(): void {
    this._componentVisualEditorService.canvaEditorComponent = this;
    this._componentVisualEditorService.onSelectElement.subscribe(this.onSelectelement);
  }

  ngAfterViewInit(): void {
    this._componentVisualEditorService.onPropertyEditorWrapperInit.emit(this.componentPropertyContainer);
    this._changeDedectionRef.detectChanges();

    Split([this.componentCanvaEditorWrapper.nativeElement, this.componentPropertyWrapper.nativeElement], {
      sizes: [75, 25],
      gutterSize: 15
    });
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
