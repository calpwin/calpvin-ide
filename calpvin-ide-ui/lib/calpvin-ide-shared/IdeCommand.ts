import { Guid } from 'guid-typescript';

export enum CommandType {
  ReadFile
}

export interface IdeCommand {
  commandType: CommandType;
  data: string;
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
    // if (e.origin === 'http://localhost:3000') {
    //   return;
    // }

    const data = e.data as IdeCommand;

    if (!data || !data.uniqueIdentifier) { return; }

    if (this.receiveEventListener != null) {
      this.receiveEventListener(e);
    }

    const waiter = this.messageEventWaiters.find(x => x.command.uniqueIdentifier === data.uniqueIdentifier);

    if (!waiter) { return; }

    waiter.resolve(data);

    this.messageEventWaiters = this.messageEventWaiters.filter(x => x.command.uniqueIdentifier !== data.uniqueIdentifier);
  }

  sendEvent(command: IdeCommand, isWaiting = true): Promise<IdeCommand> | undefined {
    const promise = isWaiting
      ? new Promise<IdeCommand>((resolve, rejected) => {
        this.messageEventWaiters.push({ command, resolve, rejected });
      })
      : undefined;

    this.sendWindow.postMessage(command, '*');

    return promise;
  }
}

interface MessageEventWaiter {
  command: IdeCommand;
  resolve: (value?: IdeCommand | PromiseLike<IdeCommand>) => void;
  rejected: (reason?: any) => void;
}

