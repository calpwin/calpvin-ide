import { Directive, Renderer2, ElementRef } from '@angular/core';
import { Guid } from 'guid-typescript';

@Directive({
  selector: '[cideComponent]'
})
export class CideComponentDirective {

  constructor(private renderer: Renderer2, hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'cide-component');
    renderer.addClass(hostElement.nativeElement, 'cide-component-' + Guid.create().toString());
  }

}
