import IApplicationMessage  from "./IApplicationMessage";
import { TSeverity }        from "../common/TSeverity";
import IReportDevBarMessage from "./IReportDevBarMessage";

interface INotificationMessage extends IApplicationMessage, IReportDevBarMessage {
    severity: TToastSeverity,
    toast: boolean,
    buttonLabel?: string,
    buttonSeverity?: TSeverity
    buttonURL?: string,
    buttonURLInNewTab?: boolean
    life?: number,
    new?: boolean,
}

export = INotificationMessage;