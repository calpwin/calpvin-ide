import {
  LatafiComponentDisplayMode
} from '@latafi/component-visual-editor/src/lib/services/component-visual-editor.service/reducer/latafi-component';

export class FlexboxWrapperModel {
  flexDirection: LatafiComponentDisplayMode;
  verticalAlign: 'top' | 'center' | 'bottom' = 'center';
  horizontalAlign: 'left' | 'center' | 'right' = 'center';
  itemsAlignSpace: 'space-between' | 'space-around' | 'space-empty' = 'space-empty';
}
