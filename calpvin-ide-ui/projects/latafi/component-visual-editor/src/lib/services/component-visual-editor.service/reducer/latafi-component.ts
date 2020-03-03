export class LatafiComponent {
  constructor(public readonly uniqueClassName: string, public readonly baseEl: HTMLElement) {
  }

  isSelected = false;
  isWrapperEl = false;
  wrapperComponentId?: string;
  wrapperDisplayMode: LatafiComponentDisplayMode;
}

export enum LatafiComponentDisplayMode {
  Relative = 0,
  Absolute = 1,
  FlexRow = 2,
  FlexColumn = 3
}
