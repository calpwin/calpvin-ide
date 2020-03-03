import { createAction, createReducer, props, on, Action, createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { Actions, ofType, Effect, createEffect } from '@ngrx/effects';
import { LatafiComponent, LatafiComponentDisplayMode } from './latafi-component';
import { Injectable } from '@angular/core';
import { switchMap, map, exhaustMap, withLatestFrom } from 'rxjs/operators';
import { ComponentVisualEditorService } from '../component-visual-editor.service';
import { ComponentGroupingService } from '../../component-grouping/component-grouping.service';

//#region States

export interface VisualComponentEditorState {
  wrapperComponent?: LatafiComponent;
  selectedComponents: LatafiComponent[];
  innerComponents: LatafiComponent[];
}

export const initialVisualComponentEditorState: VisualComponentEditorState = {
  selectedComponents: [],
  innerComponents: []
}

//#endregion

//#region Selectors

export const visualComponentEditorFeatureSelector = createFeatureSelector('visualComponentEditorFeature');

export const lastSelectedComponentSelector = createSelector(
  visualComponentEditorFeatureSelector,
  (state: VisualComponentEditorState) => state.selectedComponents.length > 0
    ? state.selectedComponents[state.selectedComponents.length - 1]
    : null);

export const selectedComponentsSelector = createSelector(
  visualComponentEditorFeatureSelector,
  (state: VisualComponentEditorState) => state.selectedComponents);

export const wrapperComponentSelector = createSelector(
  visualComponentEditorFeatureSelector,
  (state: VisualComponentEditorState) => state.wrapperComponent);

//#endregion

//#region Actions

export const addWrapperComponentAction = createAction(
  '[Component Visual Editor] Add latafi component',
  props<{ wrapperComp: LatafiComponent }>());

export const addInnerComponentsAction = createAction(
  '[Component Visual Editor] Wrapper components rebuild',
  props<{ components: LatafiComponent[] }>());


export const setLatafiComponentDisplayModeAction = createAction(
  '[Component Visual Editor] Set latafi component display mode',
  props<{ uniqueClassName: string, displayMode: LatafiComponentDisplayMode }>());

export const setSelectedComponentAction = createAction(
  '[Component Visual Editor] Set selected component',
  props<{ uniqueClassName?: string, toGroup: boolean }>());

export const unselectComponentAction = createAction(
  '[Component Visual Editor] Unselect component',
  props<{ uniqueClassName?: string }>());

//#endregion

//#region Reducers

export const latafiComponentListReducer = createReducer(
  initialVisualComponentEditorState,
  on(addWrapperComponentAction, (state, { wrapperComp: newComp }) => {
    newComp.isWrapperEl = true;
    return { ...state, wrapperComponent: newComp };
  }),
  on(addInnerComponentsAction, (state, { components }) => {
    return { ...state, innerComponents: Array.from(components) }
  }),
  on(setLatafiComponentDisplayModeAction, (state, { uniqueClassName, displayMode }) => {
    const comps = Array.from(state.innerComponents);
    if (state.wrapperComponent) { comps.push(state.wrapperComponent); }

    const comp = comps.find(c => c.uniqueClassName === uniqueClassName) as LatafiComponent;

    if (comp) { comp.wrapperDisplayMode = displayMode; }

    return { ...state };
  }),
  on(setSelectedComponentAction, (state, { uniqueClassName, toGroup }) => {
    let list = Array.from(state.selectedComponents);
    const findComp = state.innerComponents.find(x => x.uniqueClassName === uniqueClassName);

    if (findComp && !findComp.isSelected) {
      findComp.isSelected = true;
      list.push(findComp);
      return { ...state, selectedComponents: toGroup ? list : [findComp] };
    } else if (findComp?.isSelected) {
      return { ...state };
    }

    state.innerComponents.filter(x => x.isSelected).forEach(comp => comp.isSelected = false);
    return { ...state, selectedComponents: [] };
  }),
  on(unselectComponentAction, (state, { uniqueClassName }) => {
    let list = Array.from(state.selectedComponents);
    const findComp = state.innerComponents.find(x => x.uniqueClassName === uniqueClassName);

    if (findComp && findComp.isSelected) {
      findComp.isSelected = false;
      list = list.filter(x => x.uniqueClassName !== findComp.uniqueClassName);
      return { ...state, selectedComponents: list };
    }

    return { ...state };
  }));

//#endregion

@Injectable()
export class VisualComponentEditorEffects {
  constructor(
    private readonly _actions: Actions,
    private readonly _componentVisualEditorService: ComponentVisualEditorService,
    private readonly _componentGroupingService: ComponentGroupingService) {
  }

  addLatafiComponentEffect = createEffect(() => this._actions.pipe(
    ofType(addWrapperComponentAction),
    map(action => {
      const components = this._componentVisualEditorService.rebuildWrapperComponents(action.wrapperComp.baseEl);
      if (action.wrapperComp.wrapperComponentId) { this._componentGroupingService.setBlockDimenisions(action.wrapperComp.baseEl); }
      return addInnerComponentsAction({ components });
    })
  ))
}


