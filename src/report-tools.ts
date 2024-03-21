import IApplicationMessage from "./types/applicationEvent/IApplicationMessage";

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

