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

import { Button }                            from "primereact/button";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import * as React                            from "react";
import { useTranslation }                    from "react-i18next";
import { useLocation }                       from "react-router-dom";

import TextareaLog                  from "../common/TextareaLog";
import { useOpenedReports }         from "../../utils/hooks";
import { sortAndFormatLogEntries }  from "../../report-tools";
import { isReportDevBar }           from "../../utils/applicationMessage";
import IReportDevBarMessage         from "../../types/application-event/IReportDevBarMessage";
import { EReportDevBarMessageType } from "../../types/application-event/EReportDevBarMessageType";
import { Message }                  from "primereact/message";

const Debug: React.FC = (): React.ReactElement => {

    const {t} = useTranslation(['common', 'settings']);
    const location = useLocation();
    const openedReports = useOpenedReports();

    const [selectedReportId, setSelectedReportId] = React.useState<number>(0);

    const [logsReport, setLogsReport] = React.useState<IReportDevBarMessage[]>([]);
    const [logs, setLogs] = React.useState<IReportDevBarMessage[]>([]);
    const [errorsReport, setErrorsReport] = React.useState<IReportDevBarMessage[]>([]);
    const [errors, setErrors] = React.useState<IReportDevBarMessage[]>([]);

    React.useEffect(() => {

        const matchDebugReportId = new RegExp(/debug\/report\/(\d{1,10})/g).exec(location.pathname);

        if (matchDebugReportId) {

            setSelectedReportId(Number(matchDebugReportId[1]));
        }
    }, [location]);

    // Use to add / remove the reportDevBarEvent listener and handle the event.
    React.useEffect(() => {

        const handleReportDevBarEvent = (
            (event: CustomEvent<IReportDevBarMessage>) => {

                //console.debug('handleReportDevBarEvent', event)

                if (isReportDevBar(event.detail)) {

                    switch (event.detail.type) {

                        case EReportDevBarMessageType.ERROR_REPORT:
                            setErrorsReport(prevErrors => [...prevErrors, event.detail]);
                            break;

                        case EReportDevBarMessageType.ERROR:
                            setErrors(prevErrors => [...prevErrors, event.detail]);
                            break;

                        case EReportDevBarMessageType.LOG_REPORT:
                            setLogsReport(prevLogs => [...prevLogs, event.detail]);
                            break;

                        case EReportDevBarMessageType.LOG:
                        default:
                            setLogs(prevLogs => [...prevLogs, event.detail]);
                            break;
                    }
                }
            }
        ) as EventListener;

        document.addEventListener("reportDevBarEvent", handleReportDevBarEvent);

        return () => {

            document.removeEventListener("reportDevBarEvent", handleReportDevBarEvent);
        }
    }, []);

    const template = (options: PanelHeaderTemplateOptions) => {
        const toggleIcon = options.collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up';

        return (
            <div className={`${options.className} p-0`}>
                <Button
                    className="p-button-text p-button-secondary text-left w-full"
                    onClick={options.onTogglerClick}
                    icon={toggleIcon}
                    label={options.props.header as string}
                />
            </div>
        )
    }

    return (
        <div className="px-3 grid">
            {(!openedReports || (openedReports && openedReports.length === 0)) &&
                <Message
                    style={{width: '100%'}}
                    className="m-2"
                    severity="info"
                    text={t('report:run_report_to_get_log')}
                />
            }

            {(!!openedReports && openedReports.length > 0 && selectedReportId > 0) &&
                <>
                    <Panel
                        className="col-12"
                        header={t('common:logs_report').toString()}
                        headerTemplate={template}
                        toggleable
                    >
                        <TextareaLog
                            clearLogsAction={() => setLogsReport(
                                logsReport.filter(log => log.reportId !== selectedReportId))}
                            logs={sortAndFormatLogEntries(
                                logsReport.filter(log => log.reportId === selectedReportId))}
                        />
                    </Panel>

                    <Panel
                        className="col-12"
                        header={t('report:errors_report').toString()}
                        headerTemplate={template}
                        toggleable
                    >
                        <TextareaLog
                            clearLogsAction={() => setErrorsReport(
                                errorsReport.filter(log => log.reportId !== selectedReportId))}
                            logs={sortAndFormatLogEntries(
                                errorsReport.filter(log => log.reportId === selectedReportId))}
                        />
                    </Panel>
                </>
            }

            <Panel
                className="col-12"
                header={t('common:logs').toString()}
                headerTemplate={template}
                toggleable
            >
                <TextareaLog
                    clearLogsAction={() => setLogs([])}
                    logs={sortAndFormatLogEntries(logs.filter(log => log.type === EReportDevBarMessageType.LOG))}
                />
            </Panel>

            <Panel
                className="col-12"
                header={t('common:errors').toString()}
                headerTemplate={template}
                toggleable
            >
                <TextareaLog
                    clearLogsAction={() => setLogs([])}
                    logs={sortAndFormatLogEntries(errors.filter(log => log.type === EReportDevBarMessageType.ERROR))}
                />
            </Panel>
        </div>
    );
}

export default Debug;