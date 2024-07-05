import { Chart } from "chart.js";
import React     from "react";

import TReportDataViewJs                        from "../../../../types/TReportDataViewJs";
import { reportDataViewSetChartJSConfigurator } from "../../../../contexts/report/store/actions";
// import { ERole }                                from "../../../../types/ERole";
// import TChartJsConfigurator                     from "../../../../types/TChartJsConfigurator";
// import { context as authContext }               from "../../../../contexts/auth/store/context";
import * as RTReport                            from "../../../../contexts/report/ReportContextProvider";
import TReport                                  from "../../../../types/TReport";
import { EReportViewMode }                      from "../../../../types/EReportViewMode";
import { getElementContentSize }                from "../../../../utils/htmlElement";
import TReportInstance                          from "../../../../types/TReportInstance";
import chartJsConfigurator                      from "./chartjs-configurator/ChartJsConfigurator";
import TChartJsConfigurator                     from "../../../../types/TChartJsConfigurator";

const DataViewGraphViewChartJs: React.FC<{
    dataViewJs: TReportDataViewJs,
    report: TReport,
    reportInstance: TReportInstance,
    jsonResults?: Array<Object>,
    // loading?: boolean, // true when data view is loaded don't have yet results.
    // maxWidth?: number,
    parentHeight?: number,
    parentWidth?: number,
}> = ({
          dataViewJs,
          report,
          reportInstance,
          jsonResults,
          // loading = false,
          // maxWidth,
          parentHeight,
          parentWidth,

      }): React.ReactElement => {

    // const {state: authState} = React.useContext(authContext);

    const reportDispatch = RTReport.useDispatch();
    const refCanvas = React.useRef<HTMLCanvasElement>(null);
    let chartJsObject;

    const [dataViewContainerWidthPx, setDataViewContainerWidthPx] = React.useState<string>('');
    const [dataViewContainerHeightPx, setDataViewContainerHeightPx] = React.useState<string>('');

    const [dataViewContainerWidth, setDataViewContainerWidth] = React.useState<string>('');
    const [dataViewContainerHeight, setDataViewContainerHeight] = React.useState<string>('');


    const updateCanvasContainer = () => {

        if ((!reportInstance.expandedDataViewId || reportInstance.viewMode === EReportViewMode.CLIENT) && refCanvas.current) {

            const containerElement = refCanvas.current?.closest('.data-view-card');
            // @ts-ignore
            const containerSize = getElementContentSize(refCanvas.current?.closest('.data-view-card'));
            const headerSize = getElementContentSize(containerElement?.querySelector('.p-card-header'));
            const bodySize = getElementContentSize(containerElement?.querySelector('.p-card-body'));
            const contentSize = getElementContentSize(containerElement?.querySelector('.p-card-body > .p-card-content'));

            const subgridWidth = (containerSize?.width || 0) - (bodySize?.paddingX || 0);
            // const subgridHeight = (containerSize?.height || 0) - (headerSize?.height || 0) - (bodySize?.paddingY || 0) - (contentSize?.paddingY || 0);
            // Calculate the height by removing header and paddings from the parentHeight
            const subgridHeight = (parentHeight || 0) - (headerSize?.height || 0) - (bodySize?.paddingY || 0) - (contentSize?.paddingY || 0);

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
    }

    // Initialize ChartJsConfigurator object
    React.useEffect(() => {

        if (!dataViewJs.chartJsConfigurator) {

            console.debug('----------------------------------------------------------');
            console.debug(' -> JSON.parse(dataViewJs.json_form) 1', JSON.parse(dataViewJs.json_form));

            reportDispatch(
                reportDataViewSetChartJSConfigurator(
                    {
                        reportId: report.id,
                        dataViewId: dataViewJs.report_data_view_id,
                        chartJsConfigurator: JSON.parse(dataViewJs.json_form)
                    }
                ));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataViewJs.json_form]);


    //
    React.useEffect(() => {

        if (refCanvas.current && dataViewJs.chartJsConfigurator) {

            console.debug(' -> dataViewJs.chartJsConfigurator 2', dataViewJs.chartJsConfigurator);

            // @ts-ignore
            chartJsObject = Chart.getChart(refCanvas.current.id);

            if (chartJsObject) {

                chartJsObject.data = dataViewJs.chartJsConfigurator.chartJsSetup.config.data;
                chartJsObject.options = dataViewJs.chartJsConfigurator.chartJsSetup.config.options;
                chartJsObject.update();
            } else {

                chartJsObject = new Chart(
                    refCanvas.current,
                    {
                        type: 'bar',
                        data: dataViewJs.chartJsConfigurator.chartJsSetup.config.data,
                        options: dataViewJs.chartJsConfigurator.chartJsSetup.config.options
                    }
                );
            }
        }
    }, [jsonResults, refCanvas.current, dataViewJs.chartJsConfigurator]);


    // Use to update the canvas container when view window is resized, or view mode changed.
    //
    React.useEffect(() => {

        updateCanvasContainer();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parentWidth, parentHeight, reportInstance.expandedDataViewId, reportInstance.viewMode]);

    return (
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
    );
};

export default DataViewGraphViewChartJs;