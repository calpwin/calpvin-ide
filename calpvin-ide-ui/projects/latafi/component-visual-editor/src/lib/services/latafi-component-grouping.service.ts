import { Injectable, ElementRef } from '@angular/core';
import { ComponentVisualEditorService } from '../../public-api';
import { LatafiInjectableService } from '@latafi/core/src/lib/services/injectable.service';

@Injectable({
  providedIn: 'root'
})
export class LatafiComponentGroupingService extends LatafiInjectableService {

  constructor(private readonly _componentVisualEditorService: ComponentVisualEditorService) {
    super();
  }

  onBaseAppConstruct() {
    this._componentVisualEditorService.onSelectElement.subscribe(this.onVisualEditorSelectElement);
  }

  private onVisualEditorSelectElement = (el: ElementRef<HTMLElement> | undefined) => {
    console.log('Select EL!');

  }
}
