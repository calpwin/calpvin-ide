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
    private readonly _renderer: Renderer2,
    public readonly elementRef: ElementRef<HTMLElement>,
    private readonly _layoutService: LayoutService) { }


  ngOnInit(): void {
    this._componentVisualEditorService.canvaEditorComponent = this;
    this._componentVisualEditorService.onSelectElement.subscribe(this.onSelectElement);
  }

  ngAfterViewInit(): void {
    this._componentVisualEditorService.onPropertyEditorWrapperInit.emit(this.componentPropertyContainer);
    this._changeDedectionRef.detectChanges();

    this._layoutService.propertyEditorLayoutElRef = this.componentPropertyWrapper;
  }

  onSelectElement = (el: ElementRef<HTMLElement>) => {
    if (el) {
      this.addSelectedElBorder(el.nativeElement);
    }

    if (this._componentVisualEditorService.isDeselectPreviouseEl && this._componentVisualEditorService.previousSelectedElement) {
      this.removeElBorder(this._componentVisualEditorService.previousSelectedElement.nativeElement);
    }
  }


  onCanvaClick(event: MouseEvent) {
    this._componentVisualEditorService.selectedElement = undefined;
  }

  private addSelectedElBorder(selectedEl: HTMLElement) {
    const appendBorderFragment = (...cssStyle: string[]) => {
      const el = this._renderer.createElement('div') as HTMLElement;
      el.classList.add(...cssStyle);
      this._renderer.appendChild(selectedEl, el);
    };

    // appendBorderFragment('latafi-resizer', 'latafi-resizer-top');
    appendBorderFragment('latafi-resizer', 'latafi-resizer-right');
    appendBorderFragment('latafi-resizer', 'latafi-resizer-bottom');
    // appendBorderFragment('latafi-resizer', 'latafi-resizer-left');

    this._renderer.addClass(selectedEl, 'latafi-resizable');
  }

  private removeElBorder(hostEl: HTMLElement) {
    const borderFragments = hostEl.querySelectorAll('.latafi-resizer');
    borderFragments.forEach(fragment => fragment.remove());

    this._renderer.removeClass(hostEl, 'latafi-resizable');
  }
}
