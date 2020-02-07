import { Injectable, Inject } from "@angular/core";
import { Workspace, EventManager, EventType } from 'calpvin-ide-shared';
import { EventManagerService } from './event-manager.service';

Injectable({
  providedIn: 'root'
});
export class WorkspaceService {

  constructor(@Inject(EventManagerService) private _eventManagerService: EventManagerService) {

  }

  private _activeWorkspace: Workspace;
  public get activeWorkspace(): Workspace {
    return this._activeWorkspace;
  }
  public set activeWorkspace(v: Workspace) {
    this._activeWorkspace = v;

    this._eventManagerService.EventManager.sendEvent<Workspace>({
      eventType: EventType.SetWorkspace,
      uniqueIdentifier: EventManager.generateUniqueIdentifire(),
      data: this._activeWorkspace
    }, false);
  }


  public get activeModule(): string {
    return this._activeWorkspace.activeModule;
  }
  public set activeModule(value: string) {
    this._activeWorkspace.activeModule = value;

    this._eventManagerService.EventManager.sendEvent<Workspace>({
      eventType: EventType.SetWorkspace,
      uniqueIdentifier: EventManager.generateUniqueIdentifire(),
      data: this._activeWorkspace
    }, false);
  }

  public get activeComponent(): string {
    return this._activeWorkspace.activeComponent;
  }
  public set activeComponent(value: string) {
    this._activeWorkspace.activeComponent = value;

    this._eventManagerService.EventManager.sendEvent<Workspace>({
      eventType: EventType.SetWorkspace,
      uniqueIdentifier: EventManager.generateUniqueIdentifire(),
      data: this._activeWorkspace
    }, false);
  }
}
