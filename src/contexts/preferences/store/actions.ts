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
