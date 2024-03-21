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

import { TNameValue }          from "../types/TNameValue";
import TReportParameter        from "../types/TReportParameter";
import { getPlaceholderValue } from "./report";
import TSQLResultColumn        from "../types/TSQLResultColumn";

export const replaceParametersPlaceholders = (text: string, reportParameterInputValues: TNameValue[], reportParameters: TReportParameter[]): string => {

    if (reportParameterInputValues.length === 0 || reportParameters.length === 0) {

        return text;
    }

    const regexp = /\[(\w+)\]/g;
    const placeholders = [...text.matchAll(regexp)].map(m => m[1]);
    let newText = text;

    placeholders.forEach(p => {
        const value = getPlaceholderValue(p, reportParameterInputValues, reportParameters);
        newText = newText.replace(`[${p}]`, value);
    });

    return newText;
}

export const replaceColumnsPlaceholders = (text: string, columns: TSQLResultColumn[]): string => {

    if (columns.length === 0 || columns.length === 0) {

        return text;
    }

    const regexp = /\{(\w+)\}/g;
    const placeholders = [...text.matchAll(regexp)].map(m => m[1]);
    let newText = text;

    placeholders.forEach(p => {
        const value = columns.find(c => c.name === p)?.value;
        newText = newText.replace(`{${p}}`, value);
    });

    return newText;
}

export const wrapPlaceholdersWithSpan = (text: string) => {
    const regexp = /(\[\w+\])|(\{\w+\})/g;
    const placeholders = [...text.matchAll(regexp)].map(m => m[0]);

    let newText = text;

    placeholders.forEach(p => {
        newText = newText.replace(`${p}`, `<span>${p}</span>`);
    });

    return newText;
}