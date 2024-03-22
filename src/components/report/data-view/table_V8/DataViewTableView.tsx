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

import { ContextMenu }            from "primereact/contextmenu";
import { Dialog }                 from "primereact/dialog";
import { MenuItem }               from "primereact/menuitem";
import { OverlayPanel }           from "primereact/overlaypanel";
import * as React                 from 'react';
import { useTranslation }         from "react-i18next";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import DOMPurify                  from 'dompurify';
import round                      from 'lodash.round';

import {
    getAggregationFnV8,
    getColumnFooterV8, renameKeys,
    replacePlaceholder
}                                                from "../../../../utils/tableView";
import TDataViewTableForm                        from "../../../../types/TDataViewTableForm";
import ReportErrorBoundary                       from "../../ReportErrorBoundary";
import TReportLink                               from "../../../../types/TReportLink";
import DataViewTableCollapsableCell              from "../table_V8/DataViewTableCollapsableCell";
import { context as authContext }                from "../../../../contexts/auth/store/context";
import TDataViewTableColumnV8                    from "../../../../types/TDataViewTableColumnV8";
import DataViewTableLinkedCell, { isReportLink } from "../table_V8/DataViewTableLinkedCell";
import ReactTable                                from "../table_V8/ReactTable";
import DataTableSkeleton                         from "../../../skeleton/DataTableSkeleton";
import TReport                                   from "../../../../types/TReport";
import TReportInstance                           from "../../../../types/TReportInstance";
import AncestorSizeProvider                      from "../../../common/size/AncestorSizeProvider";
import TExternalLink                             from "../../../../types/TExternalLink";
import { Image }                                 from "primereact/image";

const DataViewTableView: React.FC<{
    dataViewId: number,
    expanded: boolean,
    globalForm: TDataViewTableForm['global'],
    report: TReport,
    reportInstance: TReportInstance,
    jsCode?: TDataViewTableColumnV8[],
    jsonResults?: Array<Object>,
    loading?: boolean,
}> = ({
          dataViewId,
          expanded,
          globalForm,
          report,
          reportInstance,
          jsCode,
          jsonResults,
          loading = false,
      }): React.ReactElement | null => {

    const {state: authState} = React.useContext(authContext);
    const {t} = useTranslation();

    const [columns, setColumns] = React.useState<TDataViewTableColumnV8[]>([]);
    const [overlayPanelLinks, setOverlayPanelLinks] = React.useState<Array<TReportLink | TExternalLink>>([]);
    const [overlayPanelCollapsibleContent, setOverlayPanelCollapsibleContent] = React.useState<string>('');

    const contextMenuRef = React.useRef<ContextMenu>(null);
    const overlayPanelCollapsibleRef = React.useRef<OverlayPanel>(null);

    const showLinksInOverlayPanel = (event: React.MouseEvent<HTMLButtonElement>, links: Array<TReportLink | TExternalLink>) => {

        setOverlayPanelLinks(links);
        contextMenuRef.current?.show(event);
    };

    const showCollapsibleContentInOverLayPanel = (event: React.MouseEvent<HTMLButtonElement>, content: string) => {

        setOverlayPanelCollapsibleContent(content);
        overlayPanelCollapsibleRef.current?.toggle(event);
    };

    const tableColumns = React.useMemo(() => {

        return columns.map((column) => {

            const {
                filterFn,
                footerMethod,
                footerText,
                footerRounding,
                reportLinks,
                externalLinks,
                collapsible,
                asImage,
                asImageThumbnailWidth,
                asImageThumbnailHeight,
                asImageFullSize,
                ...columnProps
            } = column;

            const footer = getColumnFooterV8(footerMethod, footerText || '', footerRounding);

            return {
                ...columnProps,
                filterFn,
                sortingFn: 'alphanumeric',
                aggregationFn: getAggregationFnV8(footerMethod),
                aggregatedCell: ({getValue}) => replacePlaceholder(footerText || '', round(getValue<number>(), footerRounding).toFixed(footerRounding)),
                cell: (cell: CellContext<any, any>) => {
                    if ((reportLinks || []).length > 0 || (externalLinks || []).length > 0) {
                        return (
                            <DataViewTableLinkedCell
                                cell={cell}
                                reportLinks={reportLinks || []}
                                externalLinks={externalLinks || []}
                                reportParameterInputValues={reportInstance.reportParameterInputValues}
                                showLinksInOverlayPanel={showLinksInOverlayPanel}
                            />
                        )
                    }

                    if (collapsible === true) {
                        return (
                            <DataViewTableCollapsableCell
                                value={cell.getValue()}
                                showCollapsibleContentInOverLayPanel={showCollapsibleContentInOverLayPanel}
                            />
                        )
                    }

                    if (asImage) {
                        return <Image
                            preview={asImageFullSize}
                            src={cell.getValue()}
                            width={asImageThumbnailWidth ? String(asImageThumbnailWidth) : undefined}
                            height={asImageThumbnailHeight ? String(asImageThumbnailHeight) : undefined}
                        />
                    }
                    return cell.getValue();
                },
                footer: ({table, column}) => footer(table, column),
            } as ColumnDef<any, unknown>;
        });
    }, [columns, reportInstance.reportParameterInputValues]);

    const data = React.useMemo((): any => {

        return renameKeys(
            jsonResults,
            (key) => key.includes('.') ? key.replace('.', '') : key,
        )
    }, [jsonResults])

    const groupByColumns = React.useMemo(() => {

        let cols: string[] = [];

        columns.forEach((column) => {

            if (column.groupBy) {

                // @ts-ignore
                cols.push(String(column.accessorKey));
            }
        });

        return cols;
    }, [columns]);

    React.useEffect(() => {

        if (jsonResults && jsonResults.length > 0) {

            setColumns(jsCode || []);
        }
    }, [jsonResults, jsCode]);

    const generateLinkMenuModel = React.useCallback((): MenuItem[] => {

        const reportLinks = overlayPanelLinks.filter((link: TReportLink | TExternalLink) => isReportLink(link)) as TReportLink[];
        const externalLinks = overlayPanelLinks.filter((link: TReportLink | TExternalLink) => !isReportLink(link)) as TExternalLink[];

        const reportLinksItems = reportLinks.map(
            (link: TReportLink) => ({
                label: link.label,
                command: link.handleClick,
                icon: `pi ${link.canBeOpenInSameTab ? 'pi-link' : 'pi-external-link'}`,
            } as MenuItem)
        )
        const externalLinksItems = externalLinks.map(
            (link: TExternalLink) => ({
                label: link.label,
                className: 'text-primary',
                icon: 'pi pi-external-link',
                url: link.url,
                target: '_blank',
            } as MenuItem)
        )
        let menuItems = [...reportLinksItems];
        if (externalLinksItems.length > 0) {
            menuItems = [
                ...menuItems,
                {label: t('report:report_link.external_ressources').toString(), disabled: true},
                // { label: 'External ressources', items: externalLinksItems }
                ...externalLinksItems,
            ];

        }

        return menuItems;
    }, [overlayPanelLinks, t]);

    if (!jsCode || !jsonResults) {

        return null;
    }

    return (
        <>
            {jsonResults && columns && (
                <ReportErrorBoundary
                    key={JSON.stringify(tableColumns)}
                    uiGrants={authState.user.organization_user.ui_grants}
                    reportId={report.id}
                    message={(
                        <>
                            <span>{t('report:dataview.table_error')}</span>
                        </>
                    )}
                >
                    <AncestorSizeProvider heightPropName="parentHeight" ancestorSelector={expanded ? '.grid-area-main-tabs-contents' : undefined}>
                        <ReactTable
                            key={`react-table-${reportInstance.id}-${dataViewId}`}
                            adjustWidthToContent={globalForm.adjust_width}
                            stickyHeader
                            stickyFooter
                            loading={loading}
                            columns={tableColumns}
                            data={data}
                            pagination={globalForm.pagination}
                            groupByConfig={{
                                groupBy: globalForm.groupBy,
                                expanded: globalForm.expanded,
                                expanded_paginate: globalForm.expanded_paginate,
                                columns: groupByColumns,
                            }}
                            loadingComponent={<DataTableSkeleton animation/>}
                        />
                    </AncestorSizeProvider>
                    <ContextMenu
                        model={generateLinkMenuModel()}
                        ref={contextMenuRef}
                        className="menu table-link-menu"
                    />
                    <Dialog
                        visible={!!overlayPanelCollapsibleContent}
                        dismissableMask
                        closable
                        closeOnEscape
                        onHide={() => setOverlayPanelCollapsibleContent('')}
                    >
                        <div
                            className="overlay-table-collapsible-content"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                    overlayPanelCollapsibleContent.replace(/(\r\n|\r|\n)/g, '<br />'),
                                    {USE_PROFILES: {html: true}},
                                ),
                            }}
                        />
                    </Dialog>
                </ReportErrorBoundary>
            )}
        </>
    );
}

export default DataViewTableView;