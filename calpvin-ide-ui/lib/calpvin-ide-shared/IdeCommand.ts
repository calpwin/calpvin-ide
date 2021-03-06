import { Guid } from 'guid-typescript';
export { Workspace as Workspace } from './workplace';

// #region Commands
export enum EventType {
  ReadComponentFile,
  WriteComponentFile,
  IdeStartEvent,
  AppHideIde,
  SetWorkspace,
  GetWorkspace,
  IdeFormatDocument
}

export enum VirtualFileType {
  ComponentHtml = 0,
  ComponentCss = 1
}

export class VirtualFile<TAst = any> {
  constructor(
    public fileType: VirtualFileType,
    public componentName: string,
    public fileName: string,
    public content?: string) {

  }

  public astTree: TAst;
}

export class ComponentFileCommand implements IdeEvent<VirtualFile> {
  eventType: EventType;
  data: VirtualFile;
  uniqueIdentifier: string;
}

export class IdeFormatDocumentCommandData {
  uri: string;
}


// #endregion

export class IdeEvent<T extends any = string> {
  eventType: EventType;
  data: T;
  uniqueIdentifier: string;
}

export class Hello {
  public say() {
    return 'Hello world!';
  }
}

export class EventManager {
  constructor(
    private window: Window,
    private sendWindow: Window,
    private receiveEventListener?: (e: MessageEvent) => void) {

    this.window.addEventListener('message', (e) => { this.receiveEvent(e); }, false);

  }

  private messageEventWaiters: MessageEventWaiter[] = [];

  static generateUniqueIdentifire() {
    return Guid.create().toString();
  }

  private receiveEvent(e: MessageEvent) {
    const data = e.data as IdeEvent;

    if (!data || !data.uniqueIdentifier) { return; }

    if (this.receiveEventListener != null) {
      this.receiveEventListener(e);
    }

    const waiter = this.messageEventWaiters.find(x => x.command.uniqueIdentifier === data.uniqueIdentifier);

    if (!waiter) { return; }

    waiter.resolve(data);

    this.messageEventWaiters = this.messageEventWaiters.filter(x => x.command.uniqueIdentifier !== data.uniqueIdentifier);
  }

  sendEvent<T = any>(command: IdeEvent<T>, isWaiting = true): Promise<IdeEvent<T>> | undefined {
    const promise = isWaiting
      ? new Promise<IdeEvent<T>>((resolve, rejected) => {
        this.messageEventWaiters.push({ command, resolve, rejected });
      })
      : undefined;

    this.sendWindow.postMessage(command, '*');

    return promise;
  }
}

interface MessageEventWaiter<T = any> {
  command: IdeEvent<T>;
  resolve: (value?: IdeEvent<T> | PromiseLike<IdeEvent<T>>) => void;
  rejected: (reason?: any) => void;
}

