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

import INotificationMessage from "../types/applicationEvent/INotificationMessage";
import IReportDevBarMessage from "../types/applicationEvent/IReportDevBarMessage";
import IApplicationMessage  from "../types/applicationEvent/IApplicationMessage";
import { isObject }         from "./tools";

const cleanMessage = (appMessage: IApplicationMessage): IApplicationMessage => {

    const {
        message,
        ...event
    } = appMessage;

    let textMessage;

    if (isObject(message)) {

        textMessage = JSON.stringify(message);
    } else {

        textMessage = message;
    }

    return {
        message: textMessage,
        ...event,
    }
}

// NotificationCenter will handle that and will dispatch :
// * in the Notification area if user hasn't DEV role.
// * in ReportDevBar if user has DEV role (and also in Notification area if asked)
export const notificationEvent = (message: INotificationMessage): CustomEvent => {

    return new CustomEvent<INotificationMessage>(
        'notificationEvent',
        {detail: cleanMessage(message) as INotificationMessage}
    )
};

export const reportDevBarEvent = (message: IReportDevBarMessage): CustomEvent => {

    return new CustomEvent<IReportDevBarMessage>(
        'reportDevBarEvent',
        {detail: cleanMessage(message) as IReportDevBarMessage}
    )
};

export const upEventResizeAceEditor = new Event('upEventResizeAceEditor');
