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

const processEnv = typeof process.env !== 'undefined' ? process.env : {};
export const appConfig = window && window.appConfig ? window.appConfig : {};

const overridableParams = [
    'REACT_APP_DEMO',
    'REACT_APP_API_URL',
    'REACT_APP_VITE_REVERB_APP_KEY',
    'REACT_APP_VITE_REVERB_HOST',
    'REACT_APP_VITE_REVERB_PORT',
    'REACT_APP_VITE_REVERB_SCHEME'
];

const filteredAppConfig = Object.assign(
    {},
    ...overridableParams.map(key => (
        appConfig[key] !== undefined ? ({ [key]: appConfig[key] }) : undefined)
    ),
);

const env = {
    ...processEnv,
    ...filteredAppConfig,
    tooltipShowDelay: 500,
    tooltipHideDelay: 0
};

export default env;
