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

import * as types        from './types';
import TUser             from "../../../types/TUser";
import { TLogin }        from "../../../types/TLogin";
import { TAPIResponse }  from "../../../types/TAPIResponsed";
import TOrganizationUser from "../../../types/TOrganizationUser";
import TUserLogin        from "../../../types/TUserLogin";

export interface IForceLogout {
    type: types.TForceLogout;
    payload: undefined;
}

export interface ILogin {
    type: types.TLogin;
    payload: TLogin
}

export interface ILoginFail {
    type: types.TLoginFail;
    payload: TAPIResponse
}

export interface ILoginSuccess {
    type: types.TLoginSuccess;
    payload: TUserLogin
}

export interface ILogout {
    type: types.TLogout;
    payload: number;
}

export interface ILoggedOut {
    type: types.TLoggedOut;
    payload: undefined;
}

export interface IOrganizationChanged {
    type: types.TOrganizationChanged;
    payload: TOrganizationUser;
}

export interface IResetPasswordSuccess {
    type: types.TResetPasswordSuccess;
    payload: TUser
}

export interface ITestDevUserExists {
    type: types.TTestDevUserExists;
    payload: boolean;
}

export interface IUserUpdated {
    type: types.TUserUpdated;
    payload: TUser;
}

export const forceLogout = (): IForceLogout => ({
    type: types.FORCE_LOGOUT,
    payload: undefined
})

export const login = (payload: TLogin): ILogin => ({
    type: types.LOGIN,
    payload,
});

export const logout = (payload: number): ILogout => ({
    type: types.LOGOUT,
    payload
})

export const organizationChanged = (payload: TOrganizationUser): IOrganizationChanged => ({
    type: types.ORGANIZATION_CHANGED,
    payload
})

export const testDevUserExists = (payload: boolean): ITestDevUserExists => ({
    type: types.TEST_DEV_USER_EXISTS,
    payload
})

export const userUpdated = (payload: TUser): IUserUpdated => ({
    type: types.USER_UPDATED,
    payload
})

export type TAuthAction =
    IForceLogout
    | ILoggedOut
    | ILogin
    | ILoginFail
    | ILoginSuccess
    | ILogout
    | IOrganizationChanged
    | IResetPasswordSuccess
    | ITestDevUserExists
    | IUserUpdated;