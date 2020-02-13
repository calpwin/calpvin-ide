import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { ComponentVisualEditorService } from './component-visual-editor.service';

@Component({
  selector: 'latafi-component-visual-editor',
  templateUrl: 'component-visual-editor.component.html',
  styleUrls: ['component-visual-editor.component.scss']
})
export class ComponentVisualEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('componentPropertyWrapper', { read: ViewContainerRef }) componentPropertyWrapper: ViewContainerRef;

  constructor(
    private readonly _componentVisualEditorService: ComponentVisualEditorService,
    private readonly _changeDedectionRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._componentVisualEditorService.onPropertyEditorWrapperInit.emit(this.componentPropertyWrapper);
    this._changeDedectionRef.detectChanges();
  }

}
