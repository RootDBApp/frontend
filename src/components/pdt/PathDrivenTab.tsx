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

import { Menubar }           from "primereact/menubar";
import { Tooltip }           from "primereact/tooltip";
import * as React            from "react";
import { DraggableProvided } from "react-beautiful-dnd";
import { useNavigate }       from "react-router-dom";
import { VscDebugConsole }   from "react-icons/vsc";
import { useTranslation }    from "react-i18next";

import { EPDTTabType }                             from "../../types/EPDTTabType";
import { IPDTabRoute }                             from "../../types/pdt/IPDTabRoute";
import { EReportViewMode }                         from "../../types/EReportViewMode";
import { nameValuesToString }                      from "../../utils/tools";
import DropdownDataViewSelector                    from "../common/form/DropdownDataViewSelector";
import { useReportStateFromReportIdAndInstanceId } from "../../contexts/report/ReportContextProvider";
import env                                         from "../../envVariables";
import ReportParametersTooltip                     from "../report/ReportParametersTooltip";
import { useOpenedReports }                        from "../../utils/hooks";
import DropDownOpenedReports                       from "../common/form/DropDownOpenedReports";
import ReportCacheInfoTooltip                      from "../report/ReportCacheInfoTooltip";

const PathDrivenTab: React.FC<{
    active: boolean,
    tab: IPDTabRoute,
    onClick?: CallableFunction,
    onClose?: CallableFunction,
    onContextMenu?: CallableFunction,
    onReportDeleted?: CallableFunction,
    provided?: DraggableProvided,
}> = ({
          tab,
          active,
          onClick,
          onClose,
          onContextMenu,
          onReportDeleted,
          provided,
      }) => {

    const {t} = useTranslation(['settings', 'common']);
    const navigate = useNavigate();
    const openedReports = useOpenedReports();

    const reportState = useReportStateFromReportIdAndInstanceId(Number(tab.reportId), Number(tab.reportInstanceID));

    const [reportMounted, setReportMounted] = React.useState<boolean>(false);
    const [reportTabTitle, setReportTabTitle] = React.useState<React.ReactElement>(<></>);
    const [debugTabTitle, setDebugTabTitle] = React.useState<React.ReactElement>(<></>);

    // const op = React.useRef<OverlayPanel | null>(null);

    // Handle Report tab.
    React.useEffect(() => {

        // console.debug('=================================================================');
        // console.debug('=== PathDrivenTab - reportState.report)', reportState.report);
        // console.debug('=== PathDrivenTab - reportState.instance', reportState.instance);

        // Tab contain a Report with all Data Views.
        if (tab.reportId
            && reportState.report
            && reportState.instance
            && !reportState.instance.expandedDataViewId
        ) {

            setReportMounted(true);
            setReportTabTitle(<>{reportState.report.name || `Report ${tab.reportId}`}</>)
        }
        // Tab contain a Data view (edit mode, only for dev)
        else if (tab.reportId
            && reportState.report
            && reportState.instance
        ) {

            setReportTabTitle(
                <div className="rdb-tab-data-view-edit">
                    <Menubar className="py-0"
                             start={
                                 <div>
                                     <span className={active ? 'active-tab' : 'inactive-tab'}>
                                         {reportState.report?.name || `Report ${tab.reportId}`}
                                     </span>
                                     <i className="pi pi-angle-right ml-2 mr-2" style={{cursor: 'default'}}></i>
                                 </div>
                             }
                             end={
                                 <div onClick={event => event.stopPropagation()} className="tab-select-data-view  flex">

                                     <div className="flex align-items-center justify-content-center">
                                         <i className="pi pi-pencil ml-1 mr-1" style={{cursor: 'default'}}></i>
                                     </div>
                                     <div className="tab-dropdown-data-view flex align-items-center justify-content-center">
                                         <DropdownDataViewSelector
                                             dataViews={(reportState.report?.dataViews || [])}
                                             dataViewId={reportState.instance.expandedDataViewId}
                                             onChange={(event) => {

                                                 if (reportState.instance && event.value > 0) {

                                                     navigate(`/report/${reportState.report?.id}_${tab.reportInstanceID}/data-view/${event.value}?view-mode=${reportState.instance.viewMode}&${nameValuesToString(reportState.instance.reportParameterInputValues.filter(param => param.name !== 'run'))}`);
                                                 } else if (reportState.instance) {

                                                     navigate(`/report/${reportState.report?.id}_${tab.reportInstanceID}?view-mode=${reportState.instance.viewMode}&${nameValuesToString(reportState.instance.reportParameterInputValues.filter(param => param.name !== 'run'))}`);
                                                 }
                                             }}
                                         />
                                     </div>

                                     <div className="flex align-items-center justify-content-center">
                                         <Tooltip
                                             target={`#closed_data_view_edit_tab_${reportState.instance.expandedDataViewId}`}
                                             showDelay={env.tooltipShowDelay}
                                             hideDelay={env.tooltipHideDelay}
                                         />
                                         <i className="pi pi-times  mr-2"
                                            id={`closed_data_view_edit_tab_${reportState.instance.expandedDataViewId}`}
                                            data-pr-tooltip={t('report:dataview.leave_data_view_edit').toString()}
                                            data-pr-position="bottom"
                                            onClick={(event) => {

                                                event.stopPropagation();
                                                if (reportState.instance) {

                                                    navigate(`/report/${reportState.report?.id}_${tab.reportInstanceID}?view-mode=${EReportViewMode.CLIENT}&${nameValuesToString(reportState.instance.reportParameterInputValues.filter(param => param.name !== 'run'))}`);
                                                }
                                            }}
                                         ></i>
                                     </div>
                                 </div>
                             }
                    />

                </div>
            );
        } else if (!tab.reportId && tab.type === EPDTTabType.DEBUG) {

            setDebugTabTitle(
                <div className="rdb-tab-data-view-edit">
                    <Menubar className="py-0"
                             start={
                                 <div>
                                     <span className={active ? 'active-tab' : 'inactive-tab'}>
                                        <i className={`pi mr-2 ${openedReports && openedReports.length === 0 ? 'mt-2' : ''}`}><VscDebugConsole/></i>{t('common:logs').toString()}
                                     </span>
                                     {openedReports && openedReports.length > 0 && <i className="pi pi-angle-right ml-2 mr-2" style={{cursor: 'default'}}></i>}
                                 </div>
                             }
                             end={
                                 <div onClick={event => event.stopPropagation()} className="tab-select-data-view  flex">

                                     <div className="tab-dropdown-data-view flex align-items-center justify-content-center">
                                         <DropDownOpenedReports/>
                                     </div>

                                 </div>
                             }
                    />

                </div>
            );
        }

        // Close the tab.
        if (tab.reportId && !reportState.report?.id && reportMounted && onReportDeleted) {

            onReportDeleted(tab.id);
        }

    }, [
        active,
        navigate,
        openedReports,
        onReportDeleted,
        reportMounted,
        reportState.instance,
        reportState.instance?.viewMode,
        reportState.report,
        t,
        tab.id,
        tab.reportId,
        tab.reportInstanceID,
        tab.type
    ]);

    return (
        <>
            {tab.type === EPDTTabType.REPORT
                && reportState.report
                && reportState?.instance
                && reportState.instance.viewMode !== EReportViewMode.DEV
                && ((
                        (reportState.report?.parameters?.length || [].length) > 0
                        && reportState?.report?.parameters
                        && reportState?.instance?.reportParameterInputValues
                    ) || (
                        reportState.instance.results_from_cache
                        && reportState.instance.results_cache_type
                        && reportState.instance.results_cached_at
                    )
                ) &&

                <Tooltip
                    className="report-parameters-tab-preview"
                    target={`#report-tab-${reportState.report.id}-${reportState.instance.id}`}
                    position="bottom"
                    showDelay={env.tooltipShowDelay}
                    hideDelay={env.tooltipHideDelay}
                    // hideDelay={200000}
                >
                    <>
                        {((reportState.report?.parameters?.length || [].length) > 0
                                && reportState?.report?.parameters
                                && reportState?.instance?.reportParameterInputValues) &&
                            <ReportParametersTooltip
                                reportParameters={reportState.report.parameters}
                                reportParameterInputValues={reportState.instance.reportParameterInputValues}
                            />
                        }

                        {(reportState.instance.results_from_cache && reportState.instance.results_cache_type && reportState.instance.results_cached_at) &&
                            <ReportCacheInfoTooltip reportInstance={reportState.instance}/>
                        }
                    </>
                </Tooltip>
            }

            <li className={`p-unselectable-text ${active ? ' p-tabview-selected p-highlight' : ''}`}
                id={`${(reportState.report?.id && reportState.instance?.id) ? 'report-tab-' + reportState.report.id + '-' + reportState.instance.id : 'default-tab-id'}`}
                role="presentation"
                key={tab.id}
                ref={provided?.innerRef}
                {...provided?.draggableProps}
                {...provided?.dragHandleProps}
            >
                <span role="tab"
                      className={`p-tabview-nav-link ${active ? 'active-tab' : 'inactive-tab'} `}
                      onContextMenu={(event) => {

                          if (onContextMenu) {

                              onContextMenu(event);
                          }
                      }}
                      onClick={() => {

                          if (onClick) {

                              onClick()
                          }
                      }}
                >
                    {reportState?.instance?.isLoading && (<i className="pi pi-spin pi-spinner mr-2"/>)}

                    <span className="p-tabview-title" style={{marginBottom: '-3px'}}>
                        {tab.type === EPDTTabType.HOME && <><i className="pi pi-home mr-2"></i>{t('common:home')}</>}

                        {tab.type === EPDTTabType.HELP && <><i className="pi pi-question mr-2"></i>{t('common:help')}</>}

                        {tab.type === EPDTTabType.INPUT_PARAMETERS && <><i className="pi pi-sliders-h mr-2"></i>{t('settings:menu.input_parameters').toString()}</>}

                        {tab.type === EPDTTabType.SQL_CONSOLE && <><i className="pi pi-desktop mr-2"></i>{t('common:sql_console').toString()}</>}

                        {tab.type === EPDTTabType.DEBUG && debugTabTitle}

                        {tab.type === EPDTTabType.REPORT && reportTabTitle}

                    </span>

                    <Tooltip
                        target={`#closed_data_view_edit_tab_${tab.type}_${reportState.report?.id ?? '_'}_${tab.type}_${reportState.instance?.id ?? '_'}`}
                        position="bottom"
                        showDelay={env.tooltipShowDelay}
                        hideDelay={env.tooltipHideDelay}
                    />
                    <span
                        onClick={(e) => {

                            e.stopPropagation();
                            if (onClose) {

                                onClose()
                            }
                        }}
                        className="pi pi-times-circle clickable-icon"
                        id={`closed_data_view_edit_tab_${tab.type}_${reportState.report?.id ?? '_'}_${tab.type}_${reportState.instance?.id ?? '_'}`}
                        data-pr-tooltip={t('common:close_tab').toString()}
                        data-pr-position="bottom"
                        data-pr-showdelay={env.tooltipShowDelay}
                        data-pr-hidedelay={env.tooltipHideDelay}
                    />

                </span>
            </li>
        </>
    )
        ;
}

export default PathDrivenTab;
