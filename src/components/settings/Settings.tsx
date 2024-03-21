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

import * as React      from 'react';
import { useLocation } from 'react-router-dom';


import { context as authContext } from "../../contexts/auth/store/context";
import CenteredLoading            from "../common/loading/CenteredLoading";
import { userCanAdminSomeStuff }  from "../../utils/user";

const Administration = React.lazy(() => import('./Administration'));
const UserPreferences = React.lazy(() => import('../user/UserPreferences'));
const UserProfile = React.lazy(() => import('./UserProfile'));

const Settings: React.FC = () => {

    const {state: authState} = React.useContext(authContext);
    const currentLocation = useLocation();

    return (
        <React.Suspense fallback={<CenteredLoading/>}>
            {currentLocation.pathname === '/settings/user-preferences'
                && <UserPreferences/>}

            {currentLocation.pathname === '/settings/user-profile'
                && <UserProfile/>}

            {userCanAdminSomeStuff(authState.user.organization_user.ui_grants)
                && currentLocation.pathname.indexOf('/settings/admin') >= 0
                && <Administration/>}
        </React.Suspense>
    );
}

export default Settings;
