import { Injectable } from '@angular/core';
import { EventManager } from 'calpvin-ide-shared';

@Injectable({
  providedIn: 'root'
})
export class EventManagerService {
  public EventManager: EventManager;

  init(window: Window, sendWindow: Window, eventListener?: (e: MessageEvent) => void) {
    this.EventManager = new EventManager(window, sendWindow, eventListener);
  }
}
