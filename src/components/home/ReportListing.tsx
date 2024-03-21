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

import { Button }            from "primereact/button";
import { ListBox }           from "primereact/listbox";
import { OverlayPanel }      from "primereact/overlaypanel";
import { Tooltip }           from "primereact/tooltip";
import * as React            from "react";
import { useTranslation }    from "react-i18next";
import { Link, useNavigate } from "react-router-dom";


import apiDataContext                                       from "../../contexts/api_data/store/context";
import TReport                                              from "../../types/TReport";
import TCategory                                            from "../../types/TCategory";
import { reportFavoriteAdd, reportFavoriteRemove }          from "../../contexts/api_data/store/actions";
import * as RTReport                                        from "../../contexts/report/ReportContextProvider";
import { reportSetFavorite }                                from "../../contexts/report/store/actions";
import CategoryForm                                         from "../settings/CategoryForm";
import ReportParameters                                     from "../report/ReportParameters";
import { FAVORITES_DIRECTORY_ID }                           from "../../utils/definitions";
import { context as authContext }                           from "../../contexts/auth/store/context";
import { generateReportUniqId, isThereConnectorConfigured } from "../../utils/tools";
import TDirectoryTreeNode                                   from "../../types/TDirectoryTreeNode";
import { apiSendRequest }                                   from "../../services/api";
import { EAPIEndPoint }                                     from "../../types/EAPIEndPoint";
import TReportDataView                                      from "../../types/TReportDataView";
import { reportDevBarEvent }                                from "../../utils/events";
import { EReportDevBarMessageType }                         from "../../types/applicationEvent/EReportDevBarMessageType";
import DropdownDataViewSelector                             from "../common/form/DropdownDataViewSelector";
import CenteredLoading                                      from "../common/loading/CenteredLoading";
import { getDirectoryFamilyReportsCount }                   from "../../utils/report";
import env                                                  from "../../envVariables";
import { handleVisibilityReportChange }                     from "../../utils/headerMenu/reportMenu";

const ReportListing: React.FC<{
    directoryTreeNode: TDirectoryTreeNode,
    level?: number
}> = ({
          directoryTreeNode,
          level = 1
      }): React.ReactElement => {

    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const {state: authState} = React.useContext(authContext);

    const {t} = useTranslation(['report']);
    const navigate = useNavigate();
    const reportDispatch = RTReport.useDispatch();

    const [reports, setReports] = React.useState<Array<TReport>>([]);
    const [categories, setCategories] = React.useState<Array<TCategory>>([]);
    const categoryFormOverlayRef = React.useRef<OverlayPanel>(null);
    const reportParameterFormOverlayRef = React.useRef<OverlayPanel>(null);
    const reportDataViewsOverlayRef = React.useRef<OverlayPanel>(null);
    const [currentCategoryEdited, setCurrentCategoryEdited] = React.useState<TCategory | undefined>(undefined);
    const [currentReport, setCurrentReport] = React.useState<TReport | undefined>(undefined);
    const [reportDataViews, setReportDataViews] = React.useState<{ reportId: number, dataViews: TReportDataView[] }>();
    const [opened, setOpened] = React.useState(true);
    const directory = Number(directoryTreeNode.key) !== FAVORITES_DIRECTORY_ID ? apiDataState.directories.find(d => d.id === Number(directoryTreeNode.key)) : undefined;
    const directoryName = Number(directoryTreeNode.key) === FAVORITES_DIRECTORY_ID
        ? t('common:favorites')
        : String(directory?.name || '');

    const handleOnClickFavorite = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, report: TReport): void => {

        e.stopPropagation();
        if (report?.favorite) {

            apiDataDispatch(reportFavoriteRemove(report));
        } else {

            apiDataDispatch(reportFavoriteAdd(report));
        }

        reportDispatch(reportSetFavorite({report_id: report.id, favorite: !report?.favorite}));
    }

    const itemTemplate = (report: TReport): React.ReactNode => {

        return (
            <div
                className={`flex p-p-1 card report-list-item flex-wrap align-items-center`}>
                <div className="mr-1 w-max">
                    {Number(directoryTreeNode.key) === FAVORITES_DIRECTORY_ID ?
                        <>
                            {report.name}
                            <br/>
                            <span className="report-list-directory">
                                {report.directory?.name}
                            </span>
                        </>
                        :
                        <>{report.name}</>
                    }
                    {(report.description_listing && report.description_listing.length > 0) &&
                        <>
                            <br/>
                            <span className="report-list-desc">
                                {report.description_listing}
                            </span>
                        </>
                    }
                </div>
                <div className="ml-auto flex flex-nowrap height-auto">
                    {/*<div className="p-buttonset splitted-button flex flex-nowrap">*/}
                    <Button
                        type="button"
                        icon="pi pi-play"
                        className="p-button-text"
                        tooltip={report.has_parameters ? t('report:run_report_with_default_parameters_without_shortcuts').toString() : t('report:run_report_without_shortcut').toString()}
                        tooltipOptions={{
                            position: 'bottom',
                            showDelay: env.tooltipShowDelay,
                            hideDelay: env.tooltipHideDelay
                        }}
                        onClick={() => navigate('/report/' + generateReportUniqId(report.id) + '?run')}
                    />

                    {report.has_parameters && (
                        <Button
                            type="button"
                            icon="pi icon-play-parameters"
                            className="p-button-text"
                            tooltip={t('report:input_parameters').toString()}
                            tooltipOptions={{
                                position: 'bottom',
                                showDelay: env.tooltipShowDelay,
                                hideDelay: env.tooltipHideDelay
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentReport(report);
                                reportParameterFormOverlayRef?.current?.toggle(e, e.target);
                            }}
                        />
                    )}

                    {/*</div>*/}
                    <Button
                        type="button"
                        icon={`pi ${report.favorite ? 'pi-bookmark-fill' : 'pi-bookmark'}`}
                        className="p-button-secondary p-button-text"
                        tooltip={report.favorite ? t('report:remove_from_favourites').toString() : t('report:add_to_favorites').toString()}
                        tooltipOptions={{
                            position: 'bottom',
                            showDelay: env.tooltipShowDelay,
                            hideDelay: env.tooltipHideDelay
                        }}
                        onClick={e => handleOnClickFavorite(e, report)}
                    />

                    {(!authState.user.is_super_admin
                            && authState.user.organization_user.ui_grants.report.edit && !report.is_visible) &&
                        <Button
                            type="button"
                            icon="pi pi-eye-slash"
                            className="p-button-text"
                            tooltip={`${t('report:change_report_visibility').toString()}
${t('report:currently_not_visible').toString()}`}
                            tooltipOptions={{
                                position: 'bottom',
                                showDelay: env.tooltipShowDelay,
                                hideDelay: env.tooltipHideDelay
                            }}
                            onClick={() => handleVisibilityReportChange(
                                {reportId: report.id, is_visible: true},
                                apiDataDispatch,
                                reportDispatch
                            )}
                        />
                    }

                    {(!authState.user.is_super_admin
                            && authState.user.organization_user.ui_grants.report.edit
                        ) &&
                        <>
                            <Button
                                type="button"
                                icon="pi pi-fw pi-server"
                                className="p-button-text"
                                tooltip={t('report:cache.setup_cache_jobs').toString()}
                                tooltipOptions={{
                                    position: 'bottom',
                                    showDelay: env.tooltipShowDelay,
                                    hideDelay: env.tooltipHideDelay
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/report-configuration/cache-jobs-configuration/${report.id}`);
                                }}
                            />
                        </>
                    }


                    {!authState.user.is_super_admin
                        && authState.user.organization_user.ui_grants.report.edit &&
                        <>
                            <Button
                                type="button"
                                icon="pi pi-sliders-v"
                                className="p-button-text"
                                tooltip={t('report:report_configuration').toString()}
                                tooltipOptions={{
                                    position: 'bottom',
                                    showDelay: env.tooltipShowDelay,
                                    hideDelay: env.tooltipHideDelay
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/report-configuration/${report.id}`);
                                }}
                            />
                        </>
                    }

                    {!authState.user.is_super_admin
                        && authState.user.organization_user.ui_grants.report.edit
                        && report.has_data_views &&
                        <>
                            <Button
                                type="button"
                                icon="pi pi-pencil"
                                className="p-button-text"
                                tooltip={t('report:dataview.edit_a_data_view').toString()}
                                tooltipOptions={{
                                    position: 'bottom',
                                    showDelay: env.tooltipShowDelay,
                                    hideDelay: env.tooltipHideDelay
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    reportDataViewsOverlayRef?.current?.hide()
                                    reportDataViewsOverlayRef?.current?.show(e, e.target)
                                    apiSendRequest({
                                        method: 'GET',
                                        endPoint: EAPIEndPoint.REPORT_DATA_VIEW,
                                        urlParameters: [{
                                            key: 'report-id',
                                            value: Number(report.id)
                                        }, {key: 'for-listing', value: 1}],
                                        callbackSuccess: (response: Array<TReportDataView>) => {

                                            setReportDataViews({reportId: report.id, dataViews: response});
                                        },
                                        callbackError: () => {

                                            document.dispatchEvent(
                                                reportDevBarEvent({
                                                    reportId: Number(report.id),
                                                    timestamp: Date.now(),
                                                    title: 'Report Id #' + Number(report.id),
                                                    message: 'Error while getting report data views',
                                                    type: EReportDevBarMessageType.ERROR_REPORT,
                                                })
                                            );
                                        }
                                    });
                                }}
                            />
                        </>
                    }
                </div>
            </div>
        );
    }

    React.useEffect(() => {

        let currentCategories: Array<TCategory> = [];

        // Get all favorites reports if selected, or by default.
        if (Number(directoryTreeNode.key) === 0 || Number(directoryTreeNode.key) === FAVORITES_DIRECTORY_ID) {

            // Get all reports.
            setReports(apiDataState.reports.filter(report => report.favorite));
            // Generate categories.
            apiDataState.reports.filter(report => report.favorite).forEach(report => {

                if (!currentCategories.find(category => category?.id === report.category?.id)) {

                    if (report.category) {
                        currentCategories.push(report.category);
                    }
                }
            });

        } else {
            // Get all reports.
            setReports(apiDataState.reports.filter(report => report.directory?.id === Number(directoryTreeNode.key)));
            // Generate categories.
            apiDataState.reports.filter(report => report.directory?.id === Number(directoryTreeNode.key)).forEach(report => {

                if (!currentCategories.find(category => category?.id === report.category?.id)) {

                    if (report.category) {

                        currentCategories.push(report.category);
                    }
                }
            })
        }

        setCategories(currentCategories.sort(function (a, b) {

            const categoryAName = a.name.toUpperCase();
            const categoryBName = b.name.toUpperCase();

            if (categoryAName < categoryBName) {
                return -1;
            }
            if (categoryAName > categoryBName) {
                return 1;
            }

            // names must be equal
            return 0;
        }));


    }, [directoryTreeNode.key, apiDataState]);

    if (Number(directoryTreeNode.key) === FAVORITES_DIRECTORY_ID && reports.length === 0) return <></>;

    if (getDirectoryFamilyReportsCount(directoryTreeNode) === 0) return <></>;

    return (
        <div className="directory-panel">
            {authState.user.organization_user.ui_grants.report.edit &&
                <>
                    <OverlayPanel
                        ref={categoryFormOverlayRef}
                        id={`overlay-category-form`}
                        className=""
                        style={{width: '1000px'}}
                    >
                        <CategoryForm
                            category={currentCategoryEdited}
                            nbReports={apiDataState.reports.filter(r => r.category?.id === currentCategoryEdited?.id).length}
                        />
                    </OverlayPanel>
                </>
            }

            <OverlayPanel
                ref={reportParameterFormOverlayRef}
                id={`overlay-report-parameter-form`}
                className=""
                style={{width: '400px'}}
                onHide={() => setCurrentReport(undefined)}
            >
                {currentReport && <ReportParameters report={currentReport} onSubmit={() => {
                    reportParameterFormOverlayRef?.current?.hide();
                }}/>}
            </OverlayPanel>

            <OverlayPanel
                ref={reportDataViewsOverlayRef}
                id={`overlay-report-data-views`}
                className=""
                style={{minWidth: '200px'}}
                onHide={() => setReportDataViews(undefined)}
            >
                {reportDataViews ? (
                    <DropdownDataViewSelector
                        dataViews={reportDataViews.dataViews}
                        onChange={(event) => {

                            reportDataViewsOverlayRef.current?.hide()
                            navigate(`/report/${generateReportUniqId(reportDataViews.reportId)}/data-view/${event.value}/?run`)
                        }}
                    />
                ) : (
                    <CenteredLoading size={1}/>
                )}
            </OverlayPanel>

            <div className="directory-header">
                    <span className="directory-name">
                        <i
                            className={`collapsible-directory cursor-pointer pi ${opened ? 'pi-folder-open' : 'pi-folder'}`}
                            onClick={() => setOpened(!opened)}
                        />
                        {directoryName}
                        {!!directory && !!directory?.description && (
                            <>
                                <Tooltip
                                    target={`#directory-desc-${directoryTreeNode.key}`}
                                    position="bottom"
                                    content={directory.description}
                                    showDelay={env.tooltipShowDelay}
                                    hideDelay={env.tooltipHideDelay}
                                />
                                <i
                                    className="pi pi-info-circle ml-2 cursor-pointer"
                                    id={`directory-desc-${directoryTreeNode.key}`}
                                    style={{fontSize: '1rem'}}
                                />
                            </>
                        )}
                    </span>
                {!authState.user.is_super_admin
                    && authState.user.organization_user.ui_grants.report.edit
                    && isThereConnectorConfigured(apiDataState.connectors, authState.user.organization_user.organization)
                    && Number(directoryTreeNode.key) !== FAVORITES_DIRECTORY_ID
                    && (
                        <Link to={`/create-report/${directoryTreeNode.key}`}>
                            <Button
                                className="p-button p-button-secondary p-button-sm"
                                icon="pi pi-plus"
                                label={t('report:form.create_report').toString()}
                            />
                        </Link>
                    )}
            </div>

            <div className={`directory-content level-${level}`} style={!opened ? {display: 'none'} : {}}>
                <div className="directory-reports-and-children grid">

                    {categories.map((category) => {

                            const categoryFromCache = apiDataState.categories.find(categoryLooped => categoryLooped.id === category.id);

                            return (
                                <div key={category.id}
                                     className={`col-12 lg:col-6 xl:col-4 p-panel panel-category`}>
                                    <div
                                        className="panel-category-title"
                                        style={{backgroundColor: `#${categoryFromCache?.color_hex}`}}
                                    >
                                        <span>
                                            {categoryFromCache?.name}
                                            {!!categoryFromCache?.description && (
                                                <>
                                                    <Tooltip
                                                        target={`#category-desc-${categoryFromCache.id}-${Number(directoryTreeNode.key)}`}
                                                        position="bottom"
                                                        content={categoryFromCache.description}
                                                        showDelay={env.tooltipShowDelay}
                                                        hideDelay={env.tooltipHideDelay}
                                                    />
                                                    <i
                                                        className="pi pi-info-circle ml-2 cursor-pointer"
                                                        id={`category-desc-${categoryFromCache.id}-${Number(directoryTreeNode.key)}`}
                                                        style={{fontSize: '1rem'}}
                                                    />
                                                </>
                                            )}
                                        </span>

                                        {authState.user.organization_user.ui_grants.report.edit &&
                                            <i className="pi pi-pencil panel-category-update-icon p-button-rounded p-button-success"
                                               onClick={event => {
                                                   setCurrentCategoryEdited(categoryFromCache);
                                                   categoryFormOverlayRef?.current?.toggle(event, event.target)
                                               }}
                                            />
                                        }
                                    </div>
                                    <ListBox
                                        options={
                                            reports.filter(report => report.category?.id === category.id).map(report => {

                                                report.label = report.name;
                                                report.value = report.id
                                                return report;

                                            }).sort((a, b) => {

                                                const reportAName = a.name.toUpperCase();
                                                const reportBName = b.name.toUpperCase();

                                                if (reportAName < reportBName) {
                                                    return -1;
                                                }
                                                if (reportAName > reportBName) {
                                                    return 1;
                                                }

                                                // names must be equal
                                                return 0;
                                            })
                                        }
                                        itemTemplate={itemTemplate}
                                    />
                                </div>
                            )
                        }
                    )}
                </div>
                {directoryTreeNode.children && directoryTreeNode.children.length > 0 && (
                    <>
                        {directoryTreeNode.children.map(c => (
                            <React.Fragment key={c.key}>
                                <ReportListing directoryTreeNode={c} level={level + 1}/>
                            </React.Fragment>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

export default ReportListing;


