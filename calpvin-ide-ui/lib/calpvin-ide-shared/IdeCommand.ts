import { Guid } from "guid-typescript";

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
  constructor(private sendWindow: Window, private receiveWindow: Window) {

    receiveWindow.addEventListener('message', this.receiveEvent)

  }

  private receiveEvent(e: MessageEvent) {

  }

  private waitingResponse: string[] = [];

  sendEvent(data: string): Promise<IdeCommand> {
    const guid = Guid.create().toString();
    this.waitingResponse.push(guid);

    this.sendWindow.postMessage({
      commandType: CommandType.ReadFile,
      uniqueIdentifier: guid,
      data: data
    }, '*');
  }
}

