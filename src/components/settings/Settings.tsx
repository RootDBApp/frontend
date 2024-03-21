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
