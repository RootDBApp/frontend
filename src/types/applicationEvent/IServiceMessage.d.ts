import IApplicationMessage   from "./IApplicationMessage";
import { TSeverity }         from "../common/TSeverity";

interface IServiceMessage extends IApplicationMessage {
    severity: TSeverity,
    serviceMessageId: number,
}

export = IServiceMessage;