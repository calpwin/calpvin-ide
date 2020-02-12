import { Injectable, ElementRef, Type, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentVisualEditorService {

  constructor() {
  }

  private _selectedElement: ElementRef | undefined;
  public get selectedElement(): ElementRef | undefined {
    return this._selectedElement;
  }
  public set selectedElement(v: ElementRef | undefined) {
    this._selectedElement = v;
  }

  add = new EventEmitter();
}
