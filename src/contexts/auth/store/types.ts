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

export const FORCE_LOGOUT = 'FORCE_LOGOUT';
export type TForceLogout = typeof FORCE_LOGOUT;

export const LOGIN = 'LOGIN';
export type TLogin = typeof LOGIN

export const LOGIN_FAIL = 'LOGIN_FAIL';
export type TLoginFail = typeof LOGIN_FAIL;

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export type TLoginSuccess = typeof LOGIN_SUCCESS;

export const LOGOUT = 'LOGOUT';
export type TLogout = typeof LOGOUT;

export const LOGGED_OUT = 'LOGGED_OUT';
export type TLoggedOut = typeof LOGGED_OUT;

export const ORGANIZATION_CHANGED = 'ORGANIZATION_CHANGED';
export type TOrganizationChanged = typeof ORGANIZATION_CHANGED;

export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export type TResetPasswordSuccess = typeof RESET_PASSWORD_SUCCESS;

export const TEST_DEV_USER_EXISTS = 'TEST_DEV_USER_EXISTS';
export type TTestDevUserExists = typeof TEST_DEV_USER_EXISTS;
export const USER_UPDATED = 'USER_UPDATED';
export type TUserUpdated = typeof USER_UPDATED;

