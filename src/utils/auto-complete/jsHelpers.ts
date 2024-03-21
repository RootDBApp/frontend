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

import { TAceCompletion } from "../../types/TAceCompletion";

export const jsHelpers: Array<TAceCompletion> = [
    {
        name: 'jsHelper',
        value: 'rdb.backgroundColors[]',
        score: 100,
        caption: '',
        meta: 'Array<string>'
    },
    {
        name: 'jsHelper',
        value: 'rdb.cjsOnHoverCursor();',
        score: 100,
        caption: '',
        meta: '(event: any, chart: any): void - for chartJS only.'
    },
    {
        name: 'jsHelper',
        value: 'rdb.getReportPathWithParams();',
        score: 100,
        caption: '',
        meta: '(report: number, parameters: Array<TURLParameter>): string'
    },
    {
        name: 'jsHelper',
        value: 'rdb.getTextColor()',
        score: 100,
        caption: '',
        meta: '(): string'
    },
    {
        name: 'jsHelper',
        value: 'rdb.getSurfaceBorder();',
        score: 100,
        caption: '',
        meta: '(): string'
    },
    {
        name: 'jsHelper',
        value: 'rdb.getTextColorSecondary();',
        score: 100,
        caption: '',
        meta: '(): string'
    },
    {
        name: 'jsHelper',
        value: 'rdb.log();',
        score: 100,
        caption: '',
        meta: '(object: any): void'
    },
    {
        name: 'jsHelper',
        value: 'rdb.sortArrayByKeyStringASC();',
        score: 100,
        caption: '',
        meta: '(array: Array<any>, key: string): Array<any>'
    },
];