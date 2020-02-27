import { createAction, createReducer, props, on, ActionReducerMap } from '@ngrx/store';
import { LatafiComponent, LatafiComponentDisplayMode } from './latafi-component';

//#region States

export interface LatafiComponentListState {
  wrapperComponent: LatafiComponent | undefined;
  allComponent: LatafiComponent[];
}

export const initialLatafiComponentListState: LatafiComponentListState = {
  wrapperComponent: undefined,
  allComponent: []
}

//#endregion

//#region Actions

export const addLatafiComponentAction = createAction(
  '[Visual Editor] Add latafi component',
  props<{ newComp: LatafiComponent }>());

export const setLatafiComponentWrapperELAction = createAction(
  '[Visual Editor] Set latafi component wrapper element',
  props<{ uniqueClassName: string, wrapperEL: HTMLElement }>());

export const setLatafiComponentDisplayModeAction = createAction(
  '[Visual Editor] Set latafi component display mode',
  props<{ uniqueClassName: string, displayMode: LatafiComponentDisplayMode }>());

//#endregion

//#region Reducers

export const latafiComponentListReducer = createReducer(
  initialLatafiComponentListState,
  on(addLatafiComponentAction, (state, { newComp }) => {
    const list = Array.from(state.allComponent);
    list.push(newComp);
    return { ...state, allComponent: list };
  }),
  on(setLatafiComponentWrapperELAction, (state, { uniqueClassName, wrapperEL }) => {
    const comp = state.allComponent.find(c => c.uniqueClassName === uniqueClassName) as LatafiComponent;
    if (comp) { comp.wrapperEl = wrapperEL; }
    return { ...state };
  }),
  on(setLatafiComponentDisplayModeAction, (state, { uniqueClassName, displayMode }) => {
    const comp = state.allComponent.find(c => c.uniqueClassName === uniqueClassName) as LatafiComponent;

    if (comp) { comp.wrapperDisplayMode = displayMode; }

    return { ...state };
  }));

//#endregion


