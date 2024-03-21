import { TPreferencesAction } from './actions';
import { IPreferencesState }  from './initialState';
import * as types             from './types';

const reducer = (state: IPreferencesState, action: TPreferencesAction): IPreferencesState => {

    const {type, payload} = action;

    switch (type) {

        case types.DEFAULT_ORGANIZATION_CHANGED:
            localStorage.setItem('defaultOrganization', String(payload));
            return {...state, defaultOrganizationId: payload} as IPreferencesState;

        case types.EDITOR_PPREFERENCES_CHANGED:
            localStorage.setItem('editorPreferences', JSON.stringify(payload));
            return {...state, editorPreferences: payload} as IPreferencesState;

        case types.FULL_SCREEN_ACTIVATED:
            localStorage.setItem('fullScreenActivated', JSON.stringify(payload));
            return {...state, fullScreenActivated: payload} as IPreferencesState;

        default:
            return state;
    }
};

export default reducer;

