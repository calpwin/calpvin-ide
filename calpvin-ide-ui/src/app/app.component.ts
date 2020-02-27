import { Component, ViewChild, OnInit, ElementRef, HostListener, PlatformRef, ApplicationRef, Injector, } from '@angular/core';
import { EventType, IdeEvent, Workspace } from 'calpvin-ide-shared/IdeCommand';
import { EventManagerService } from '@latafi/core/src/lib/services/event-manager.service';
import { VirtualFileTreeService } from '@latafi/core/src/lib/services/virtual-tree.service';
import { WorkspaceService } from '@latafi/core/src/lib/services/workspace.service';
import { LatafiInjectableService } from '@latafi/core/src/lib/services/injectable.service';
import Split from 'split.js';
import { LayoutService } from '@latafi/core/src/lib/services/layout.service';
import { Store, select, createFeatureSelector, createSelector } from '@ngrx/store';
import { LatafiComponentListState, addLatafiComponentAction, setLatafiComponentDisplayModeAction } from '@latafi/component-visual-editor';
import { LatafiComponent, LatafiComponentDisplayMode } from '@latafi/component-visual-editor/src/lib/services/component-visual-editor.service/reducer/latafi-component';
import { Observable } from 'rxjs';

@Component({
  selector: 'cide-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private virtualFileTree: VirtualFileTreeService,
    private _workspaceService: WorkspaceService,
    private _el: ElementRef<HTMLElement>,
    private _eventManagerService: EventManagerService,
    private readonly _injector: Injector,
    private readonly _layoutService: LayoutService,
    private readonly _store: Store<{ latafiComponentList: LatafiComponentListState }>) {
    this.constractExtensions();
  }

  title = 'calpvin-ide';

  @ViewChild('ide', { read: ElementRef, static: true }) _ideLayoutElRef: ElementRef<HTMLElement>;
  @ViewChild('ideEditor', { read: ElementRef, static: true }) _canvaEditorLayoutElRef: ElementRef<HTMLElement>;

  async ngOnInit() {
    this._eventManagerService.init(
      window,
      (this._ideLayoutElRef.nativeElement.querySelector('iframe') as any).contentWindow,
      this.messageEventListener);

    this.initExtensions();

    this._layoutService.canvaEditorLayoutElRef = this._canvaEditorLayoutElRef;
    this._layoutService.ideLayoutElRef = this._ideLayoutElRef;

    const newComp = new LatafiComponent('uniqueId', null);
    this._store.dispatch(addLatafiComponentAction({ newComp }));

    const selector = createSelector(
      createFeatureSelector<LatafiComponentListState>('visualComponentEditorFeature'),
      (state: LatafiComponentListState) => state);

    this._store.select(selector).subscribe(v => console.log(v));

    // const newComp2 = new LatafiComponent('uniqueId2', null);
    // this._store.dispatch(addLatafiComponentAction({ newComp: newComp2 }));

    this._store.dispatch(setLatafiComponentDisplayModeAction(
      { uniqueClassName: 'uniqueId', displayMode: LatafiComponentDisplayMode.FlexColumn }));


    // this.enablePanelSplit();
  }

  private initExtensions() {
    const exts = this._injector.get(LatafiInjectableService) as unknown as LatafiInjectableService[];

    exts.forEach(ext => {
      ext.onAppInit();
    });
  }

  private constractExtensions() {
    const exts = this._injector.get(LatafiInjectableService) as unknown as LatafiInjectableService[];

    exts.forEach(ext => {
      ext.onBaseAppConstruct();
    });
  }

  private messageEventListener = async (e: MessageEvent) => {
    // console.log('Main: ', e);

    const command = (e.data as IdeEvent<any>);

    if (command.eventType === EventType.IdeStartEvent) {
      await this.virtualFileTree.addComponentFiles('test-component');
    } else if (command.eventType === EventType.AppHideIde) {
      this._layoutService.collapse(false);
    } else if (command.eventType === EventType.SetWorkspace) {
      this._workspaceService.activeWorkspace = command.data as Workspace;
    }
  }

  async onCideComponentClick(event: MouseEvent) {

  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.altKey && event.key === 'q') {
      this._layoutService.collapse();
    } else if (event.altKey && event.key === 's') {
      this.virtualFileTree.saveAsync();
    }
  }
}
