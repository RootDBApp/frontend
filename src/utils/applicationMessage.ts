import INotificationMessage from "../types/applicationEvent/INotificationMessage";
import IReportDevBarMessage from "../types/applicationEvent/IReportDevBarMessage";
import IApplicationMessage  from "../types/applicationEvent/IApplicationMessage";

export function isNotification(message: IApplicationMessage): message is INotificationMessage {

    return (message as INotificationMessage).toast !== undefined;
}

export function isReportDevBar(message: IApplicationMessage): message is IReportDevBarMessage {

    return (message as IReportDevBarMessage).type !== undefined;
}