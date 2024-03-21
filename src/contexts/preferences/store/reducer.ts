/*
 * This file is part of RootDB.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * AUTHORS
 * PORQUET Sébastien <sebastien.porquet@ijaz.fr>
 * ROBIN Brice <brice@robri.net>
 */

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

