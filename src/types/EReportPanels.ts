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

export enum EReportPanel {
    QUERY_INIT = 'query-init',
    DATA_VIEWS = 'data-views',
    QUERY_CLEANUP = 'query-cleanup',
}
export type EReportPanels = {
    [EReportPanel.QUERY_INIT]: boolean,
    [EReportPanel.DATA_VIEWS]: boolean,
    [EReportPanel.QUERY_CLEANUP]: boolean,
};