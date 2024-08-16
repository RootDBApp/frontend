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

import React, { ErrorInfo } from 'react';

import CenteredError                            from "../common/loading/CenteredError";
import { notificationEvent, reportDevBarEvent } from "../../utils/events";
import { EReportDevBarMessageType }             from "../../types/application-event/EReportDevBarMessageType";
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