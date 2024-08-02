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

import * as React      from 'react';
import { useNavigate } from "react-router-dom";

import TReportDataViewJs          from "../../../../types/TReportDataViewJs";
import CenteredNoData             from "../../../common/loading/CenteredNoData";
import { sleep, uncompress }      from "../../../../utils/tools";
import ReportErrorBoundary        from "../../ReportErrorBoundary";
import { context as authContext } from "../../../../contexts/auth/store/context";
import GraphSkeleton              from "../../../skeleton/GraphSkeleton";
import TReportInstance            from "../../../../types/TReportInstance";
import TReport                    from "../../../../types/TReport";
import { getElementContentSize }  from "../../../../utils/htmlElement";
import { reportDataViewRunError } from "../../../../contexts/report/store/actions";
import * as RTReport              from "../../../../contexts/report/ReportContextProvider";
import { EReportViewMode }        from "../../../../types/EReportViewMode";

const DataViewGraphView: React.FC<{
        dataViewJs: TReportDataViewJs,
        report: TReport,
        reportInstance: TReportInstance,
        jsonResults?: Array<Object>,
        loading?: boolean, // true when data view is loaded don't have yet results.
        maxWidth?: number,
        parentHeight?: number,
        parentWidth?: number,
        parentElementId: string,
    }> = ({
              dataViewJs,
              report,
              reportInstance,
              jsonResults,
              loading = false,
              maxWidth,
              parentHeight,
              parentWidth,
              parentElementId,
          }): React.ReactElement => {

        const {state: authState} = React.useContext(authContext);

        const reportDispatch = RTReport.useDispatch();

        const [dataViewContainerWidthPx, setDataViewContainerWidthPx] = React.useState<string>('');
        const [dataViewContainerHeightPx, setDataViewContainerHeightPx] = React.useState<string>('');

        const [dataViewContainerWidth, setDataViewContainerWidth] = React.useState<string>('');
        const [dataViewContainerHeight, setDataViewContainerHeight] = React.useState<string>('');

        // Used in user JS view (when developer is editing the code, he needs this function)
        // So, do not remove that !
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const navigate = useNavigate();

        // Chart.js
        const refCanvas = React.useRef<HTMLCanvasElement>(null);
        // D3.js, Apache ECharts
        const refDiv = React.useRef<HTMLDivElement>(null);

        const handleError = (error: any) => {

            reportDispatch(
                reportDataViewRunError(
                    {
                        report_id: report.id,
                        instance_id: reportInstance.id,
                        hash_parameters: '',
                        report_name: report.name,
                        data_view_id: dataViewJs.report_data_view_id,
                        data_view_name: dataViewJs.report_data_view?.name || '',
                        errors: ['Javascript error : ' + error.message],
                        results: [],
                        results_from_cache: false,
                        results_cache_type: "job",
                        results_cached_at: new Date(),
                        ms_elapsed: 0,
                    }
                ));
        };

        const updateCanvasContainer = () => {

            const containerElement = document.getElementById(parentElementId)?.closest('.data-view-card');
            // const containerSize = getElementContentSize((refCanvas.current || refDiv.current)?.closest('.data-view-card'));
            const headerSize = getElementContentSize(containerElement?.querySelector('.p-card-header'));
            const bodySize = getElementContentSize(containerElement?.querySelector('.p-card-body'));
            const contentSize = getElementContentSize(containerElement?.querySelector('.p-card-body > .p-card-content'));

            //let subgridWidth = (containerSize?.width || 0) - (bodySize?.paddingX || 0);
            let subgridWidth = (parentWidth || 0) - (bodySize?.paddingX || 0);
            // const subgridHeight = (containerSize?.height || 0) - (headerSize?.height || 0) - (bodySize?.paddingY || 0) - (contentSize?.paddingY || 0);
            // Calculate the height by removing header and paddings from the parentHeight
            let subgridHeight = (parentHeight || 0) - (headerSize?.height || 0) - (bodySize?.paddingY || 0) - (contentSize?.paddingY || 0);

            if (reportInstance.viewMode === EReportViewMode.DEV) {
                // subgridWidth = subgridWidth / 2;
                subgridHeight = subgridHeight / 2;
            }

            if (subgridWidth) {
                setDataViewContainerWidthPx(`${Number(subgridWidth)}px`);
                // in px         => %
                // window width  => 100
                // subgrid width => x
                //
                // x = subgrid width * 100 / window width
                // const canvas_vw = parseFloat(String(((subgrid_width-20) * 100) / window.innerWidth)).toFixed(2);
                const canvasVw = Number(subgridWidth) / window.innerWidth * 100;

                if (canvasVw <= 100) {
                    setDataViewContainerWidth(canvasVw + 'vw');
                }
            }

            if (subgridHeight) {
                setDataViewContainerHeightPx(`${Number(subgridHeight)}px`);

                // const canvas_vh = parseFloat(String(((subgrid_height-20) * 100) / window.innerHeight)).toFixed(2);
                const canvasVh = Number(subgridHeight) / window.innerHeight * 100;
                if (canvasVh <= 100) {
                    setDataViewContainerHeight(canvasVh + 'vh');
                }
            }
        }

        // Used to initialize the chart components, and eval the JS.
        React.useEffect(() => {

            // console.debug('======> [useEffect 1] dataViewJs', dataViewJs);

            try {
                if ((refCanvas.current || refDiv.current) && jsonResults && jsonResults.length >= 1) {

                    switch (dataViewJs.report_data_view_lib_version_id) {

                        case 3: { // ChartJS

                            import('chart.js')
                                .then((cjs) => {

                                    import('chart.js/helpers')
                                        .then((cjsh) => {

                                            import('../../../../utils/commonJs')
                                                .then((rdb) => {

                                                    try {

                                                        // eslint-disable-next-line no-eval
                                                        eval((dataViewJs.js_register_minified ? uncompress(dataViewJs.js_register) : dataViewJs.js_register)
                                                            + (dataViewJs.js_code_minified ? uncompress(dataViewJs.js_code) : dataViewJs.js_code)
                                                            + (dataViewJs.js_init_minified ? uncompress(dataViewJs.js_init) : dataViewJs.js_init)
                                                        );

                                                    } catch (error: any) {

                                                        handleError(error);
                                                    }
                                                })
                                        })
                                });
                            break;
                        }
                        case 4: { // D3.js

                            // @ts-ignore
                            import('d3')
                                .then((d3) => {

                                    import('../../../../utils/commonJs')
                                        .then((rdb) => {

                                            try {
                                                // eslint-disable-next-line no-eval
                                                eval((dataViewJs.js_register_minified ? uncompress(dataViewJs.js_register) : dataViewJs.js_register)
                                                    + (dataViewJs.js_code_minified ? uncompress(dataViewJs.js_code) : dataViewJs.js_code)
                                                    + (dataViewJs.js_init_minified ? uncompress(dataViewJs.js_init) : dataViewJs.js_init)
                                                );

                                                sleep(100).then(() => {
                                                    updateCanvasContainer();
                                                });
                                            } catch (error: any) {

                                                handleError(error);
                                            }
                                        })
                                });
                            break;
                        }
                        case 9: { // Apache ECharts

                            import('echarts')
                                .then((ec) => {

                                    import('../../../../utils/commonJs')
                                        .then((rdb) => {

                                            try {

                                                // eslint-disable-next-line no-eval
                                                eval((dataViewJs.js_register_minified ? uncompress(dataViewJs.js_register) : dataViewJs.js_register)
                                                    + (dataViewJs.js_code_minified ? uncompress(dataViewJs.js_code) : dataViewJs.js_code)
                                                    + (dataViewJs.js_init_minified ? uncompress(dataViewJs.js_init) : dataViewJs.js_init)
                                                );

                                            } catch (error: any) {

                                                handleError(error);
                                            }
                                        })
                                });
                            break;
                        }
                    }
                }

            } catch (error: any) {

                handleError(error);
            }

            // Render _only_ when we have change inside jsonResults
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [
            authState.user.organization_user.user_preferences.theme,
            dataViewJs.js_code,
            dataViewJs.js_init,
            dataViewJs.js_register,
            jsonResults
        ]);

        // Use to update the canvas container
        //
        React.useEffect(() => {

            // console.debug('======> [useEffect 2] DataViewGraphView');
            if (parentWidth && parentHeight) {
                updateCanvasContainer();
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [parentWidth, parentHeight, reportInstance.expandedDataViewId, reportInstance.viewMode, parentElementId]);

        return (
            <>
                {(jsonResults?.length === 0) ? (
                    loading
                        ? <GraphSkeleton animation/>
                        : <CenteredNoData/>
                ) : (
                    <ReportErrorBoundary
                        uiGrants={authState.user.organization_user.ui_grants}
                        reportId={report.id}>

                        {/*D3.js*/}
                        {dataViewJs.report_data_view_lib_version_id === 4 &&
                            <div
                                className="canvas-container"
                                style={{
                                    position: "relative",
                                    height: dataViewContainerHeight,
                                    width: dataViewContainerWidth,
                                    maxHeight: dataViewContainerHeightPx,
                                    // maxWidth: maxWidth && maxWidth > 0 ? `${maxWidth}px` : dataViewContainerWidthPx
                                    maxWidth: dataViewContainerWidthPx
                                }}
                            >
                                <div
                                    ref={refDiv}
                                    id={`divGraph-${report.id}-${reportInstance.id}-${dataViewJs.report_data_view_id}`}
                                />
                            </div>
                        }

                        {/*Chart.js*/}
                        {(dataViewJs.report_data_view_lib_version_id === 2 || dataViewJs.report_data_view_lib_version_id === 3) && (
                            <div
                                className="canvas-container"
                                style={{
                                    position: "relative",
                                    height: dataViewContainerHeight,
                                    width: dataViewContainerWidth,
                                    maxHeight: dataViewContainerHeightPx,
                                    // maxWidth: maxWidth && maxWidth > 0 ? `${maxWidth}px` : dataViewContainerWidthPx
                                    maxWidth: dataViewContainerWidthPx
                                }}
                            >
                                <canvas
                                    ref={refCanvas}
                                    id={`canvasGraph-${report.id}-${reportInstance.id}-${dataViewJs.report_data_view_id}`}
                                />
                            </div>
                        )}

                        {/*Apache ECharts*/}
                        {dataViewJs.report_data_view_lib_version_id === 9 &&
                            <div
                                className="canvas-container"
                                style={{
                                    position: "relative",
                                    height: dataViewContainerHeight,
                                    width: dataViewContainerWidth,
                                    maxHeight: dataViewContainerHeightPx,
                                    maxWidth: dataViewContainerWidthPx
                                }}
                            >
                                <div
                                    style={{width: dataViewContainerWidth, height: dataViewContainerHeight, minWidth: dataViewContainerWidth, minHeight: dataViewContainerHeight}}
                                    ref={refDiv}
                                    id={`divGraph-${report.id}-${reportInstance.id}-${dataViewJs.report_data_view_id}`}
                                />
                            </div>
                        }
                    </ReportErrorBoundary>
                )}
            </>
        )
    }
;

export default DataViewGraphView;