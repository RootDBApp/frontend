import * as types         from './types';
import TEditorPreferences from "../../../types/TEditorPreferences";

export interface IDefaultOrganizationChanged {
    type: types.TDefaultOrganizationChanged;
    payload: number
}

export interface IEditorPreferencesChanged {
    type: types.TEditorPreferencesChanged;
    payload: TEditorPreferences
}

export interface IFullScreenActivated {
    type: types.TFullScreenActivated;
    payload: boolean
}

export const defaultOrganizationChanged = (payload: number): IDefaultOrganizationChanged => ({
    type: types.DEFAULT_ORGANIZATION_CHANGED,
    payload,
});

export const editorPreferencesChanged = (payload: TEditorPreferences): IEditorPreferencesChanged => ({
    type: types.EDITOR_PPREFERENCES_CHANGED,
    payload,
});

export type TPreferencesAction =
    IDefaultOrganizationChanged
    | IEditorPreferencesChanged
    | IFullScreenActivated
    ;
