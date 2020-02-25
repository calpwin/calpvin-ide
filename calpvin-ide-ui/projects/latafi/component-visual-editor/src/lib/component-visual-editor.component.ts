import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewContainerRef, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { ComponentVisualEditorService } from './services/component-visual-editor.service/component-visual-editor.service';
import { LayoutService } from '@latafi/core/src/lib/services/layout.service';

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
    public readonly elementRef: ElementRef<HTMLElement>,
    private readonly _layoutService: LayoutService) { }


  ngOnInit(): void {
    this._componentVisualEditorService.canvaEditorComponent = this;
    this._componentVisualEditorService.onSelectElement.subscribe(this.onSelectelement);
  }

  ngAfterViewInit(): void {
    this._componentVisualEditorService.onPropertyEditorWrapperInit.emit(this.componentPropertyContainer);
    this._changeDedectionRef.detectChanges();

    this._layoutService.propertyEditorLayoutElRef = this.componentPropertyWrapper;
  }

  onSelectelement = (el: ElementRef<HTMLElement>) => {
    if (this._componentVisualEditorService.previousSelectedElement) {
      this._renderer2.setStyle(this._componentVisualEditorService.previousSelectedElement.nativeElement, 'border-bottom', '0');
    }
  }

  onCanvaClick(event: MouseEvent) {
    this._componentVisualEditorService.selectedElement = undefined;
  }
}
