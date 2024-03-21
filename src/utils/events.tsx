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
