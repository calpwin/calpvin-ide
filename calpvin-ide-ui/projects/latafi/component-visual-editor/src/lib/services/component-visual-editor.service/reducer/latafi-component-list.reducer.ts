import { createAction, createReducer, props, on } from '@ngrx/store';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { LatafiComponent, LatafiComponentDisplayMode } from './latafi-component';
import { Injectable } from '@angular/core';

//#region States

export interface LatafiComponentListState {
  wrapperComponent?: LatafiComponent;
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

export const setLatafiComponentDisplayModeAction = createAction(
  '[Visual Editor] Set latafi component display mode',
  props<{ uniqueClassName: string, displayMode: LatafiComponentDisplayMode }>());

//#endregion

//#region Reducers

export const latafiComponentListReducer = createReducer(
  initialLatafiComponentListState,
  on(addLatafiComponentAction, (state, { newComp }) => {
    let list = Array.from(state.allComponent);
    list.push(newComp);

    if (!newComp.isWrapperEl) {
      return { ...state, allComponent: list };
    }
    else {
      list = list.filter(x => x.uniqueClassName !== newComp.uniqueClassName && !x.isWrapperEl);
      list.forEach(x => x.isWrapperEl = false);

      return { ...state, allComponent: list, wrapperComponent: newComp };
    }
  }),
  on(setLatafiComponentDisplayModeAction, (state, { uniqueClassName, displayMode }) => {
    const comp = state.allComponent.find(c => c.uniqueClassName === uniqueClassName) as LatafiComponent;

    if (comp) { comp.wrapperDisplayMode = displayMode; }

    return { ...state };
  }));

//#endregion

@Injectable()
export class LatafiComponentEffects {
  constructor(private readonly _actions: Actions) {
  }

  @Effect()
  updateComponents = this._actions.pipe(
    ofType(addLatafiComponentAction),
    () => {

    }
  )
}


