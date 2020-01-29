export class ComponentFileStructure {
  htmlTemplate: ComponentFile = new ComponentFile();
}

export class ComponentFile {
  constructor(public content?: string, public url?: string) {

  }
}
