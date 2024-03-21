import { TAuthAction }                         from './actions';
import { dummyUser, IAuthState }               from './initialState';
import * as types                              from './types';
import TUser                                   from "../../../types/TUser";
import { TAPIResponse }                        from "../../../types/TAPIResponsed";
import TOrganizationUser                       from "../../../types/TOrganizationUser";
import { isThereConnectorConfiguredWithNotif } from "../../../utils/tools";

const reducer = (state: IAuthState, action: TAuthAction): IAuthState => {

    console.debug('[auth context::reducer]', action);
    const {type, payload} = action;

    switch (type) {
        case types.FORCE_LOGOUT:
        case types.LOGIN:
        case types.LOGOUT:
            return {...state, loading: true};

        case types.LOGIN_FAIL:

            return {...state, loading: false, isLoggedIn: false, loginError: payload as TAPIResponse};

        case types.LOGIN_SUCCESS:

            sessionStorage.setItem('loggedIn', 'true');

            const {web_socket_session_id, ...user} = payload;
            sessionStorage.setItem('user', JSON.stringify(user));

            let organizationId = '1';
            if (user.organization_user) {

                organizationId = String(user.organization_user.organization_id);
            }

            sessionStorage.setItem('organizationId', organizationId);
            sessionStorage.setItem('websocketSessionId', web_socket_session_id);

            return {
                ...state,
                isLoggedIn: true,
                loading: false,
                loginError: {status: '', title: '', message: ''},
                organizationId: Number(organizationId),
                user: payload as TUser,
                websocketSessionId: payload.web_socket_session_id
            };

        case types.LOGGED_OUT:

            sessionStorage.setItem('loggedIn', 'false');
            sessionStorage.removeItem('user');

            localStorage.setItem('previousOrganizationId', JSON.stringify(state.organizationId));
            localStorage.setItem('previousUserId', String(state.user?.id));

            return {
                ...state,
                loading: false,
                isLoggedIn: false,
                user: dummyUser,
                previousOrganizationId: state.organizationId,
                previousUserId: state.user?.id,
                loginError: {status: '', title: '', message: ''},
                testDevUserExists: true
            };

        case types.ORGANIZATION_CHANGED:

            const updatedUser = state.user as TUser;
            updatedUser.organization_user = payload as TOrganizationUser;
            sessionStorage.setItem('user', JSON.stringify(updatedUser));

            if (updatedUser.organization_user.ui_grants.report.edit) {

                isThereConnectorConfiguredWithNotif(updatedUser.organization_user.organization);
            }

            return {
                ...state,
                organizationId: (payload as TOrganizationUser).id,
                user: updatedUser
            }

        case types.RESET_PASSWORD_SUCCESS:

            const resetPasswordUser = state.user as TUser;
            resetPasswordUser.reset_password = false;

            sessionStorage.setItem('user', JSON.stringify(resetPasswordUser));

            return {
                ...state,
                loading: false,
                isLoggedIn: true,
                user: resetPasswordUser,
                loginError: {status: '', title: '', message: ''},
            };

        case types.TEST_DEV_USER_EXISTS:

            return {...state, testDevUserExists: payload}

        case types.USER_UPDATED:

            sessionStorage.setItem('user', JSON.stringify(payload));

            return {...state, user: payload as TUser}

        default:
            return state;
    }
};

export default reducer;

