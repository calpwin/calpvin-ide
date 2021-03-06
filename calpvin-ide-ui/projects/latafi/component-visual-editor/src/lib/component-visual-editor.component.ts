import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewContainerRef, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { ComponentVisualEditorService } from './services/component-visual-editor.service/component-visual-editor.service';
import { LayoutService } from '@latafi/core/src/lib/services/layout.service';
import { LatafiComponent } from './services/component-visual-editor.service/reducer/latafi-component';
import { Store, createSelector } from '@ngrx/store';
import { addWrapperComponentAction } from '../public-api';
import { LatafiComponentDirective } from './directives/latafi-component.directive';
import { lastSelectedComponentSelector, setSelectedComponentAction } from './reducers';

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
    public readonly hostedElRef: ElementRef<HTMLElement>,
    private readonly _layoutService: LayoutService,
    private readonly _store: Store<any>) { }

  private _previousSelectedEl?: HTMLElement;

  ngOnInit(): void {
    this._componentVisualEditorService.canvaEditorComponent = this;

    this._store.select(lastSelectedComponentSelector).subscribe(this.onSelectComponent);
  }

  ngAfterViewInit(): void {
    this._componentVisualEditorService.onPropertyEditorWrapperInit.emit(this.componentPropertyContainer);
    this._changeDedectionRef.detectChanges();

    this._layoutService.propertyEditorLayoutElRef = this.componentPropertyWrapper;
  }


  onCanvaClick(event: MouseEvent) {
    this._store.dispatch(setSelectedComponentAction({ uniqueClassName: null, toGroup: false }));
  }

  private onSelectComponent = (comp?: LatafiComponent) => {
    if (comp) { this.addSelectedElBorder(comp.baseEl); }

    if (this._componentVisualEditorService.isDeselectPreviouseEl && this._previousSelectedEl) {
      this.removeElBorder(this._previousSelectedEl);
    }

    this._previousSelectedEl = comp?.baseEl;
  }

  private addSelectedElBorder(selectedEl: HTMLElement) {
    const appendBorderFragment = (...cssStyle: string[]) => {
      const el = this._renderer.createElement('div') as HTMLElement;
      el.classList.add(...cssStyle);
      this._renderer.appendChild(selectedEl, el);
    };

    // Unnessasary
    //
    // appendBorderFragment('latafi-resizer', 'latafi-resizer-top');
    // appendBorderFragment('latafi-resizer', 'latafi-resizer-left');

    appendBorderFragment('latafi-resizer', 'latafi-resizer-right');
    appendBorderFragment('latafi-resizer', 'latafi-resizer-bottom');

    this._renderer.addClass(selectedEl, 'latafi-resizable');
  }

  private removeElBorder(hostEl: HTMLElement) {
    const borderFragments = hostEl.querySelectorAll('.latafi-resizer');
    borderFragments.forEach(fragment => fragment.remove());

    this._renderer.removeClass(hostEl, 'latafi-resizable');
  }
}
