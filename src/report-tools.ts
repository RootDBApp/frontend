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

import IApplicationMessage from "./types/application-event/IApplicationMessage";

const formatDateTime = (date: Date) => {
    return (
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0') + ':' +
        String(date.getSeconds()).padStart(2, '0')
    );
}

export function formatErrorTitle(title: string, timestamp?: number): Array<string> {

    let titleError: Array<string> = [];
    let titleDash: string = '';

    const dt = timestamp ? new Date(timestamp) : new Date();

    const titleLog = '| ' + formatDateTime(dt) + ' | ' + title + ' |';

    for (let i = 0; i < titleLog.length; i++) {
        titleDash += '-';
    }

    titleError.push(titleDash);
    titleError.push(titleLog);
    titleError.push(titleDash);

    return titleError;
}

export function formatLogEntry(log: IApplicationMessage): string {

    const dt = new Date(log.timestamp);

    return (
        formatDateTime(dt) +
        ' | ' + log.title + ' | ' +
        log.message
    );

}

export const sortAndFormatLogEntries = (logs: IApplicationMessage[]): string => {

    // Sort by timestamp asc
    const sortedLogs = [...logs].sort((a, b) => a.timestamp - b.timestamp);
    return sortedLogs.map(log => formatLogEntry(log)).join("\n");
}

export const sortAndFormatErrorEntries = (errors: IApplicationMessage[]): string => {

    // Sort by timestamp asc
    const sortedErrors = [...errors].sort((a, b) => a.timestamp - b.timestamp);
    return sortedErrors.map(error => [...formatErrorTitle(error.title, error.timestamp), error.message].join("\n")).join("\n");
}

