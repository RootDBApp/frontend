interface IApplicationMessage {
    message: string,
    timestamp: number,
    title: string,
    reportId?: number,
}

export = IApplicationMessage;
