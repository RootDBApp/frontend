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

export enum EAPIEndPoint {
    CONF_CONNECTOR = '/api/conf-connector',
    CONNECTOR_DATABASE = '/api/connector-database',
    CACHE = '/api/cache',
    CACHE_JOB = '/api/cache-job',
    CATEGORY = '/api/category',
    DIRECTORY = '/api/directory',
    DRAFT = '/api/draft',
    DRAFT_QUERIES = '/api/draft-queries',
    FETCH_LATEST_VERSION = '/api/fetch-latest-version',
    GROUP = '/api/group',
    LOGIN = '/api/login',
    LOGOUT = '/api/logout',
    ORGANIZATION = '/api/organization',
    PUBLIC_REPORT = '/api/public/report',
    PUBLIC_REPORT_DATAVIEW = '/api/public/report-data-view',
    REPORT = '/api/report',
    REPORT_DATA_VIEW = '/api/report-data-view',
    REPORT_DATA_VIEW_JS = '/api/report-data-view-js',
    REPORT_DATA_VIEW_LIB = '/api/report-data-view-lib',
    REPORT_DATA_VIEW_LIB_TYPE = '/api/report-data-view-lib-type',
    REPORT_DATA_VIEW_LIB_VERSION = '/api/report-data-view-lib-version',
    REPORT_PARAMETER = '/api/report-parameter',
    REPORT_PARAMETER_INPUT = '/api/report-parameter-input',
    REPORT_PARAMETER_INPUT_DATA_TYPE = '/api/report-parameter-input-data-type',
    REPORT_PARAMETER_INPUT_TYPE = '/api/report-parameter-input-type',
    REPORT_USER_FAVORITE = '/api/report-user-favorite',
    START_UPDATE = '/api/start-update',
    SERVICE_MESSAGE = '/api/service-message',
    SYSTEM_INFO = '/api/system-info',
    TEST_WEB_SOCKET_SERVER = '/api/test-web-socket-server',
    USER = '/api/user',
    USER_PREFERENCES = '/api/user-preferences',
}
