export class LatafiComponent {
  constructor(public readonly uniqueClassName: string, public readonly baseEl: HTMLElement) {
  }

  wrapperEl: HTMLElement;
  wrapperDisplayMode: string;
}

export interface LatafiComponentListState {
  newId: number;
}
