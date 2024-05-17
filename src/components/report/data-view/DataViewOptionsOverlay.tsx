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

import { MenuItem }       from "primereact/menuitem";
import { SpeedDial }      from "primereact/speeddial";
import { Tooltip }        from "primereact/tooltip";
import * as React         from 'react';
import { CSVLink }        from "react-csv";
import { useNavigate }    from "react-router-dom";
import { useTranslation } from "react-i18next";

import * as RTReport                       from "../../../contexts/report/ReportContextProvider";
import TReportDataView                     from "../../../types/TReportDataView";
import { apiSendRequest }                  from "../../../services/api";
import { EAPIEndPoint }                    from "../../../types/EAPIEndPoint";
import TReport                             from "../../../types/TReport";
import TReportInstance                     from "../../../types/TReportInstance";
import env                                 from "../../../envVariables";
import { EDataViewType }                   from "../../../types/EDataViewType";
import { getCSVFileName }                  from "../../../utils/tools";
import { renameKeysAndHandleBooleanValue } from "../../../utils/tableView";
import { dataviewDeletionConfirmDialog }   from "./DataViewDeletionConfirmDialog";

const DataViewOptionsOverlay: React.FC<{
    className: string
    dataView: TReportDataView,
    handleExpand: CallableFunction,
    handleDataViewConfiguration: CallableFunction,
    report: TReport,
    reportInstance: TReportInstance,
    devMode: boolean,
    jsonResults?: Array<Object>,
    style?: React.CSSProperties | undefined
}> = ({
          report,
          reportInstance,
          dataView,
          handleExpand,
          // handleDataViewConfiguration,
          className,
          devMode,
          jsonResults,
          style
      }): React.ReactElement => {

    const {t} = useTranslation(['report', 'menu']);
    const navigate = useNavigate();

    const reportDispatch = RTReport.useDispatch();

    const items = React.useMemo(() => {

            let items: MenuItem[] = [];

            if (dataView.type === EDataViewType.TABLE) {
                const preparedResults = renameKeysAndHandleBooleanValue(
                    jsonResults,
                    (key) => key.includes('.') ? key.replace('.', '') : key,
                    report.conf_connector?.connector_database_id
                ) || [];

                items.push(
                    {
                        label: t('report:dataview.export_as_csv').toString(),
                        icon: 'pi pi-file-export',
                        disabled: !(jsonResults && jsonResults.length > 0),
                        template: (item, options) => (
                            <CSVLink
                                data={preparedResults}
                                filename={getCSVFileName(report.name, dataView.name)}
                                className={options.className}
                                data-pr-tooltip={item.label}
                                role="menuitem"
                            >
                                <span className={options.iconClassName}/>
                            </CSVLink>
                        )
                    }
                )
            }

            if (devMode) {
                items.push(...[
                    {
                        label: t('report:dataview.run').toString(),
                        icon: 'pi pi-play',
                        command: () => apiSendRequest({
                            method: 'POST',
                            endPoint: EAPIEndPoint.REPORT_DATA_VIEW,
                            resourceId: dataView.id,
                            extraUrlPath: 'run',
                            formValues: {
                                useCache: reportInstance.useCache,
                                instanceId: reportInstance.id,
                                parameters: reportInstance.reportParameterInputValues,
                            },
                            callbackSuccess: () => {
                            }
                        }),
                    },
                    {
                        label: t('report:dataview.edit_data_view').toString(),
                        icon: 'pi pi-pencil',
                        command: () => handleExpand(),
                    },
                    {
                        label: t('report:dataview.report_data_view_configuration').toString(),
                        icon: 'pi pi-fw pi-sliders-v',
                        command: () => {

                            navigate(`/report-configuration/configuration-data-view/${report.id}/${dataView.id}`);
                        },
                    },
                    {
                        label: t('menu:delete').toString(),
                        icon: 'pi pi-trash',
                        command: () => dataviewDeletionConfirmDialog(dataView.id, dataView.name, report.id, reportInstance.id, reportDispatch)
                    },
                ])
            }

            return items;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            dataView.id,
            dataView.name,
            dataView.title,
            dataView.type,
            devMode,
            jsonResults,
            // handleExpand,
            // navigate,
            report.id,
            report.name,
            reportDispatch,
            reportInstance.id,
            reportInstance.reportParameterInputValues,
            t
        ]
    );

    return (
        <div style={style}>
            {items.length > 0 && (
                <>
                    <Tooltip
                        target={`#tooltip-actions-data-view-${dataView.id} .p-speeddial-action`}
                        position="left"
                        showDelay={env.tooltipShowDelay}
                        hideDelay={env.tooltipHideDelay}
                    />
                    <SpeedDial
                        id={`tooltip-actions-data-view-${dataView.id}`}
                        model={items}
                        direction={items.length > 1 ? 'down-left' : 'down'}
                        type={items.length > 1 ? 'quarter-circle' : 'linear'}
                        radius={125}
                        className={`${className} speeddial-button`}
                        showIcon="pi pi-ellipsis-v" hideIcon="pi pi-times" buttonClassName="p-button-outlined"
                    />
                </>
            )}
        </div>
    )
}

export default DataViewOptionsOverlay;