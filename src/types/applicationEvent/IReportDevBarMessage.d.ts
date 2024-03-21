import IApplicationMessage          from "./IApplicationMessage";
import { EReportDevBarMessageType } from "./EReportDevBarMessageType";

interface IReportDevBarMessage extends IApplicationMessage {
    type: EReportDevBarMessageType,
    forceInNotificationCenter?: boolean,
    forDevBarOnly?: boolean
}

export = IReportDevBarMessage;