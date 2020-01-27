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
    return 'Hello world dsjdjksdskj!';
  }
}
