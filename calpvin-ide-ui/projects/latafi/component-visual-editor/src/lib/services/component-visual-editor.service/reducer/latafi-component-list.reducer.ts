import { createAction, createReducer, props, on, ActionReducerMap } from '@ngrx/store';
import { LatafiComponent } from './latafi-component';

//#region States

export interface LatafiComponentListState {
  allComponent: LatafiComponent[];
}

export const initialLatafiComponentListState: LatafiComponentListState = {
  allComponent: [{ baseEl: null, uniqueClassName: 'ds', wrapperDisplayMode: 'ds', wrapperEl: null }]
}

//#endregion

//#region Actions

export const addLatafiComponentAction = createAction(
  '[Visual Editor] Add latafi component',
  props<{ newComp: LatafiComponent }>());

//#endregion

//#region Reducers

export const latafiComponentListReducer = createReducer<LatafiComponentListState>(
  initialLatafiComponentListState,
  on(addLatafiComponentAction, (state, { newComp }) => {
    const list = Array.from(state.allComponent);
    list.push(newComp);
    return { ...state, allComponent: list };
  }));

//#endregion


