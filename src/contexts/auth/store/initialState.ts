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

import TUser            from "../../../types/TUser";
import { TAPIResponse } from "../../../types/TAPIResponse";

export interface IAuthState {
    isLoggedIn: boolean;
    loading: boolean;
    loginError: TAPIResponse;
    organizationId: number;
    previousOrganizationId: number | undefined;
    previousUserId: number | undefined;
    // Used only with super-admin user, to display  / hide warning about missing developer account.
    testDevUserExists: boolean;
    user: TUser;
    websocketSessionId: string;
}

export const dummyUser = {
    email: '',
    email_verified_at: '',
    firstname: '',
    id: 0,
    lastname: '',
    is_super_admin: false,
    is_active: true,
    name: '',
    organization_user: {
        groups: [],
        group_ids: [],
        id: 0,
        organization_id: 0,
        organization: {id: 0, name: ''},
        roles: [],
        role_ids: [],
        ui_grants: {
            asset: {edit: false},
            cache: {edit: false},
            category: {edit: false},
            conf_connector: {edit: false},
            directory: {edit: false},
            draft: {edit: false},
            draft_queries: {edit: false},
            group: {edit: false},
            organization: {edit: false},
            report: {edit: false},
            report_data_view: {edit: false},
            report_data_view_js: {edit: false},
            report_parameter: {edit: false},
            report_parameter_input: {edit: false},
            service_message: {edit: false},
            system_info: {edit: false},
            user: {edit: false},
            user_preferences: {edit: false},
        },
        user_id: 0,
        user_preferences: {
            id: 0,
            lang: 'en',
            theme: 'saga-blue'
        }
    },
    organization_users: [],
};

export const initialState: IAuthState = {
    isLoggedIn: sessionStorage.getItem('loggedIn') === 'true',
    loading: false,
    loginError: {status: '', title: '', message: ''},
    organizationId: Number(sessionStorage.getItem('organizationId')),
    previousOrganizationId: Number(sessionStorage.getItem('previousOrganizationId')),
    previousUserId: Number(sessionStorage.getItem('previousUserId')),
    testDevUserExists: true,
    user: sessionStorage.getItem('user')
        ? JSON.parse(String(sessionStorage.getItem('user')))
        : dummyUser,
    websocketSessionId: sessionStorage.getItem('websocketSessionId') || '',
}

export default initialState;
