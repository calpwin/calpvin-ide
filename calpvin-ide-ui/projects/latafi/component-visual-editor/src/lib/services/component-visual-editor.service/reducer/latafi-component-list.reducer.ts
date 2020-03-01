import { createAction, createReducer, props, on, Action } from '@ngrx/store';
import { Actions, ofType, Effect, createEffect } from '@ngrx/effects';
import { LatafiComponent, LatafiComponentDisplayMode } from './latafi-component';
import { Injectable } from '@angular/core';
import { switchMap, map, exhaustMap } from 'rxjs/operators';
import { ComponentVisualEditorService } from '../component-visual-editor.service';
import { of } from 'rxjs';
import { state } from '@angular/animations';

//#region States

export interface VisualComponentEditorState {
  wrapperComponent?: LatafiComponent;
  innerComponents: LatafiComponent[];
}

export const initialVisualComponentEditorState: VisualComponentEditorState = {
  wrapperComponent: undefined,
  innerComponents: []
}

//#endregion

//#region Actions

export const addLatafiComponentAction = createAction(
  '[Visual Editor] Add latafi component',
  props<{ newComp: LatafiComponent }>());

export const wrapperComponentsRebuildAction = createAction(
  '[Visual Editor] Wrapper components rebuild',
  props<{ components: LatafiComponent[] }>());

export const setLatafiComponentDisplayModeAction = createAction(
  '[Visual Editor] Set latafi component display mode',
  props<{ uniqueClassName: string, displayMode: LatafiComponentDisplayMode }>());

//#endregion

//#region Reducers

export const latafiComponentListReducer = createReducer(
  initialVisualComponentEditorState,
  on(addLatafiComponentAction, (state, { newComp }) => {
    let list = Array.from(state.innerComponents);
    list.push(newComp);

    if (!newComp.isWrapperEl) {
      return { ...state, innerComponents: list };
    }
    else {
      return { ...state, wrapperComponent: newComp };
    }
  }),
  on(wrapperComponentsRebuildAction, (state, { components }) => {
    return { ...state, innerComponents: Array.from(components) }
  }),
  on(setLatafiComponentDisplayModeAction, (state, { uniqueClassName, displayMode }) => {
    const comps = Array.from(state.innerComponents);
    if (state.wrapperComponent) { comps.push(state.wrapperComponent); }

    const comp = comps.find(c => c.uniqueClassName === uniqueClassName) as LatafiComponent;

    if (comp) { comp.wrapperDisplayMode = displayMode; }

    return { ...state };
  }));

//#endregion

@Injectable()
export class VisualComponentEditorEffects {
  constructor(
    private readonly _actions: Actions,
    private readonly _componentVisualEditorService: ComponentVisualEditorService) {
  }

  updateComponents = createEffect(() => this._actions.pipe(
    ofType(addLatafiComponentAction),
    map(action => {
      if (action.newComp.isWrapperEl) {
        const components = this._componentVisualEditorService.rebuildWrapperComponents(action.newComp.baseEl);
        return wrapperComponentsRebuildAction({ components });
      }
    })
  ))
}


