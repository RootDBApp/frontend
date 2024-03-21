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

import { MenuItem }                 from "primereact/menuitem";
import { useTranslation }           from "react-i18next";
import * as React                   from "react";
import { useLocation, useNavigate } from "react-router-dom";

import * as RTReport                     from "../../contexts/report/ReportContextProvider";
import { apiSendRequest }                from "../../services/api";
import { EAPIEndPoint }                  from "../../types/EAPIEndPoint";
import MenuItemShortcutTemplate          from "../../components/common/menu/MenuItemShortcutTemplate";
import { reportShowDataViewQuery }       from "../../contexts/report/store/actions";
import TReportDataView                   from "../../types/TReportDataView";
import { EDataViewType }                 from "../../types/EDataViewType";
import { dataviewDeletionConfirmDialog } from "../../components/report/data-view/DataViewDeletionConfirmDialog";

export const useReportDataViewMenu = (): MenuItem | undefined => {

    const {t} = useTranslation(['menu', 'common', 'report']);
    const navigate = useNavigate();

    const reportState = RTReport.useReportStateReportInstanceDataViewInstanceFromLocation(useLocation().pathname);
    const reportDispatch = RTReport.useDispatch();

    const [showDataViewQuery, setShowDataViewQuery] = React.useState<boolean>(true);
    const [reportDataViewMenu, setReportDataViewMenu] = React.useState<MenuItem>();

    React.useEffect(() => {

        if (reportState.report
            && reportState.report.dataViews
            && reportState.report.dataViews.length > 0
            && reportState.instance
            && reportState.instance.expandedDataViewId
            && reportState.dataViewInstance
        ) {

            setShowDataViewQuery(reportState.dataViewInstance.showQuery);
        }
    }, [
        reportState?.dataViewInstance,
        reportState?.dataViewInstance?.showQuery,
        reportState?.instance,
        reportState?.instance?.expandedDataViewId,
        reportState?.report,
        reportState?.report?.dataViews
    ])

    React.useEffect(() => {

        if (reportState.report && reportState.instance && reportState.instance.expandedDataViewId) {

            let dataViewEdit = false;

            const currentDataView = reportState.report.dataViews?.find((dataView: TReportDataView) => dataView.id === reportState?.dataViewInstance?.id);
            if (currentDataView) {

                dataViewEdit = !(currentDataView.type === EDataViewType.GRAPH);
            }

            setReportDataViewMenu({
                label: t('report:data_view').toString(),
                items: [
                    {
                        label: `${t('report:data_view').toString()} ID`,
                        disabled: true,
                        template: (item: MenuItem, options) => (
                            <span className={`${options.className} font-bold flex justify-content-center align-items-center`}>
                                {item.label}
                                &nbsp;
                                <span className="text-lg" style={{userSelect: "text"}}>{reportState.instance?.expandedDataViewId}</span>
                            </span>
                        )
                    },
                    {separator: true},
                    {
                        label: t('report:dataview.run').toString(),
                        icon: 'pi pi-fw pi-play',
                        command: () => apiSendRequest({
                            method: 'POST',
                            endPoint: EAPIEndPoint.REPORT_DATA_VIEW,
                            // @ts-ignore - verified earlier
                            resourceId: reportState.instance.expandedDataViewId,
                            extraUrlPath: 'run',
                            formValues: {
                                // @ts-ignore - verified earlier
                                useCache: reportState.instance.useCache,
                                // @ts-ignore - verified earlier
                                instanceId: reportState.instance.id,
                                hashParameters: '',
                                // @ts-ignore - verified earlier
                                parameters: reportState.instance.reportParameterInputValues,
                            },
                            callbackSuccess: () => {
                            }
                        }),
                        template: (item: MenuItem, options: any) => <MenuItemShortcutTemplate
                            item={item}
                            options={options}
                            shortcut="Alt+Shift+R"
                        />,
                    },
                    {
                        label: showDataViewQuery ? t('report:dataview.hide_sql_panel').toString() : t('report:dataview.show_sql_panel').toString(),
                        icon: showDataViewQuery ? 'pi pi-fw pi-eye-slash' : 'pi pi-fw pi-eye',
                        command: () => reportDispatch(reportShowDataViewQuery({
                            reportId: reportState.report.id,
                            // @ts-ignore - verified earlier
                            reportInstanceId: reportState.instance.id,
                            // @ts-ignore - verified earlier
                            dataViewId: reportState.instance.expandedDataViewId,
                            show: !showDataViewQuery
                        })),
                        template: (item: MenuItem, options: any) => <MenuItemShortcutTemplate
                            item={item}
                            options={options}
                            shortcut="Alt+Shift+Q"
                        />,
                    },
                    {
                        label: `${t('common:configuration')}...`,
                        icon: 'pi pi-fw pi-sliders-v',
                        command: () => {
                            // @ts-ignore - verified earlier
                            navigate(`/report-configuration/configuration-data-view/${reportState.report.id}/${reportState.dataViewInstance.id}`);
                        }
                    },
                    {
                        label: `${t('report:dataview.edit_init_js_code')}...`,
                        icon: 'pi pi-fw pi-pencil',
                        disabled: dataViewEdit,
                        command: () => {
                            // @ts-ignore - verified earlier
                            navigate(`/report-configuration/edit-data-view-js-init-code/${reportState.report.id}/${reportState.dataViewInstance.id}`);
                        }
                    },
                    {
                        label: t('common:form.delete').toString(),
                        icon: 'pi pi-fw pi-trash',
                        // @ts-ignore - verified earlier
                        command: () => dataviewDeletionConfirmDialog(reportState.instance.expandedDataViewId, currentDataView.name, reportState.report.id, reportState.instance.id, reportDispatch)
                    },
                ],
            })
        } else {
            setReportDataViewMenu(undefined);
        }
    }, [
        navigate,
        reportDispatch,
        reportState?.instance,
        reportState?.instance?.id,
        reportState?.instance?.expandedDataViewId,
        reportState?.instance?.reportParameterInputValues,
        reportState?.dataViewInstance?.id,
        reportState?.report,
        reportState?.report?.id,
        showDataViewQuery,
        t
    ]);

    return reportDataViewMenu;
}