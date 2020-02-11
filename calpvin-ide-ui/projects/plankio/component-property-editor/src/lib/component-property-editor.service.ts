import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentPropertyEditorService {

  constructor() {

  }

  setElement(el: ElementRef) {
    console.log('Element', el);
  }
}
