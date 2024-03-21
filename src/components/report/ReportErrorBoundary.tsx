import React, { ErrorInfo } from 'react';

import CenteredError                            from "../common/loading/CenteredError";
import { notificationEvent, reportDevBarEvent } from "../../utils/events";
import { EReportDevBarMessageType }             from "../../types/applicationEvent/EReportDevBarMessageType";
import TUIGrants                                from "../../types/TUIGrants";

interface Props {
    uiGrants: TUIGrants,
    reportId?: number,
    onErrorCleanup?: Function,
    message?: React.ReactNode,
    children?: React.ReactNode,
}

export default class ReportErrorBoundary extends React.Component<Props, { hasError: boolean }> {

    constructor(props: Props) {

        super(props);
        this.state = {hasError: false};
    }

    // Update state so the next render will show the fallback UI.
    static getDerivedStateFromError() {

        return {hasError: true};
    }

    // You can also log the error to an error reporting service
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {

        const {uiGrants, reportId} = this.props;

        if (uiGrants.report.edit) {

            document.dispatchEvent(
                reportDevBarEvent({
                    reportId,
                    timestamp: Date.now(),
                    title: 'An error occured',
                    message: error.message,
                    type: EReportDevBarMessageType.ERROR_REPORT,
                })
            );
        } else {

            document.dispatchEvent(
                notificationEvent({
                    message: error.message,
                    reportId: reportId,
                    timestamp: Date.now(),
                    title: 'An error occurred',
                    type: EReportDevBarMessageType.ERROR_REPORT,
                    severity: "error",
                    toast: true,
                })
            );
        }
    }

    render() {

        const {message} = this.props;

        // You can render any custom fallback UI
        if (this.state.hasError) {
            return (
                <>
                    <CenteredError extraMessage={message}/>
                </>
            );
        }
        return this.props.children;
    }
}