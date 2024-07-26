import { Chart } from "chart.js/auto";
import React     from "react";

import TReportDataViewJs                                                                                                                                                                                          from "../../../../types/TReportDataViewJs";
import { reportDataViewSetChartJSConfigurator, reportDataViewSetChartJsConfiguratorInitialSetupDone, reportDataViewUpdateChartJsConfiguratorDataSetsFromResults, reportDataViewUpdateChartJsConfiguratorOptions } from "../../../../contexts/report/store/actions";
import * as RTReport                                                                                                                                                                                              from "../../../../contexts/report/ReportContextProvider";
import TReport                                                                                                                                                                                                    from "../../../../types/TReport";
import { EReportViewMode }                                                                                                                                                                                        from "../../../../types/EReportViewMode";
import { getElementContentSize }                                                                                                                                                                                  from "../../../../utils/htmlElement";
import TReportInstance                                                                                                                                                                                            from "../../../../types/TReportInstance";
import { getSurfaceBorder, getTextColorSecondary }                                                                                                                                                                from "../../../../utils/commonJs";
import { ChartDataset }                                                                                                                                                                                           from "chart.js";
import TChartJsConfiguratorColumnSetup                                                                                                                                                                            from "../../../../translations/TChartJsConfiguratorColumnSetup";

const DataViewGraphViewChartJs: React.FC<{
    dataViewJs: TReportDataViewJs,
    report: TReport,
    reportInstance: TReportInstance,
    jsonResults?: Array<Object>,
    // loading?: boolean, // true when data view is loaded don't have yet results.
    maxWidth?: number,
    parentHeight?: number,
    parentWidth?: number,
}> = ({
          dataViewJs,
          report,
          reportInstance,
          jsonResults,
          // loading = false,
          maxWidth,
          parentHeight,
          parentWidth,

      }): React.ReactElement => {

    const reportDispatch = RTReport.useDispatch();
    const refCanvas = React.useRef<HTMLCanvasElement>(null);

    const [dataViewContainerWidthPx, setDataViewContainerWidthPx] = React.useState<string>('');
    const [dataViewContainerHeightPx, setDataViewContainerHeightPx] = React.useState<string>('');

    const [dataViewContainerWidth, setDataViewContainerWidth] = React.useState<string>('');
    const [dataViewContainerHeight, setDataViewContainerHeight] = React.useState<string>('');

    const [chartJsObject, setChartJsObject] = React.useState<Chart>();

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

    // Handle chartjs object creation / update when datasets updated.
    React.useEffect(() => {

        if (refCanvas.current && dataViewJs.chartJsConfigurator && dataViewJs.chartJsConfigurator.initialSetupDone === true) {

            // Chart creation / update.
            if (Chart.getChart(refCanvas.current.id) && chartJsObject) {

                chartJsObject.data = dataViewJs.chartJsConfigurator.chartJsSetup.config.data;
                chartJsObject.options = dataViewJs.chartJsConfigurator.chartJsSetup.config.options;
                chartJsObject.update();
            } else {

                setChartJsObject(new Chart(
                    refCanvas.current,
                    {
                        type: dataViewJs.chartJsConfigurator.chartJsSetup.type,
                        data: dataViewJs.chartJsConfigurator.chartJsSetup.config.data,
                        options: dataViewJs.chartJsConfigurator.chartJsSetup.config.options
                    }
                ));
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refCanvas.current, dataViewJs.chartJsConfigurator?.chartJsSetup.config.options, dataViewJs.chartJsConfigurator?.chartJsSetup.config.data]);

    // Handle jsonResults updates, to generate datasets.
    React.useEffect(() => {

        if (refCanvas.current && dataViewJs.chartJsConfigurator) {

            // Handle datasets, labels & co.
            if (jsonResults && jsonResults.length > 0) {

                const labels: Array<string> = [];
                const datasets: Array<ChartDataset> = [];

                let looped_label: string;
                let looped_dataset_name: string;
                let looped_dataset_value: number | object;

                jsonResults.forEach((row) => {

                    type JsonResultsKey = keyof typeof row;
                    const label_key = dataViewJs.chartJsConfigurator?.columnSetup.labels.columnName as JsonResultsKey;
                    const dataset_name_key = dataViewJs.chartJsConfigurator?.columnSetup.datasetNames.columnName as JsonResultsKey;
                    const dataset_value_key = dataViewJs.chartJsConfigurator?.columnSetup.datasetValues.columnName as JsonResultsKey;

                    looped_label = row[label_key].toString();

                    if (!labels.find((label: string) => {

                        return label === looped_label;
                    })) {

                        labels.push(looped_label);
                    }

                    looped_dataset_name = row[dataset_name_key].toString();

                    const current_dataset = datasets.find((dataset: ChartDataset) => {
                        return dataset.label === looped_dataset_name;
                    });


                    if (dataViewJs.chartJsConfigurator?.columnSetup.datasetValues.dataType === "object") {

                        let looped_dataset_value = {}
                        dataViewJs.chartJsConfigurator?.columnSetup.datasetValues.columnNames?.forEach((columnSetup) => {

                            const dataset_value_obj_key = columnSetup.columnName as JsonResultsKey;

                            looped_dataset_value = {
                                ...looped_dataset_value,
                                [columnSetup.objectMember]: Number(row[dataset_value_obj_key])
                            }
                        });

                        if (current_dataset) {
                            // @ts-ignore
                            current_dataset.data.push(looped_dataset_value);
                        } else {
                            // @ts-ignore
                            datasets.push({label: looped_dataset_name, data: [looped_dataset_value], backgroundColor: "#166a8f"});
                        }

                    } else {
                        looped_dataset_value = Number(row[dataset_value_key]);

                        if (current_dataset) {
                            current_dataset.data.push(looped_dataset_value);
                            if (current_dataset.backgroundColor) {

                                // @ts-ignore
                                current_dataset.backgroundColor.push("#166a8f");
                            }
                        } else {
                            datasets.push({label: looped_dataset_name, data: [looped_dataset_value], backgroundColor: ["#166a8f"]});
                        }
                    }
                });

                reportDispatch(
                    reportDataViewUpdateChartJsConfiguratorDataSetsFromResults({
                        labels,
                        datasets,
                        reportId: report.id,
                        dataViewId: dataViewJs.report_data_view_id
                    })
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jsonResults, refCanvas.current]);

    // Initialize some default configurations stuff, like the right color to use depending choosen theme.
    React.useEffect(() => {

        // Initialize a new chart with some default options.
        if (refCanvas.current && dataViewJs.chartJsConfigurator && dataViewJs.chartJsConfigurator.initialSetupDone === false) {

            reportDispatch(
                reportDataViewUpdateChartJsConfiguratorOptions(
                    {
                        chartOptions: {
                            ...dataViewJs.chartJsConfigurator?.chartJsSetup.config.options,
                            scales: {
                                ...dataViewJs.chartJsConfigurator?.chartJsSetup.config.options.scales,
                                x: {
                                    ...dataViewJs.chartJsConfigurator?.chartJsSetup.config.options.scales?.x,
                                    ticks: {
                                        color: getTextColorSecondary()
                                    },
                                    grid: {
                                        ...dataViewJs.chartJsConfigurator?.chartJsSetup.config.options.scales?.x?.grid,
                                        color: getSurfaceBorder()
                                    }
                                },
                                y: {
                                    ...dataViewJs.chartJsConfigurator?.chartJsSetup.config.options.scales?.y,
                                    ticks: {
                                        color: getTextColorSecondary()
                                    },
                                    grid: {
                                        ...dataViewJs.chartJsConfigurator?.chartJsSetup.config.options.scales?.y?.grid,
                                        color: getSurfaceBorder()
                                    }
                                },
                            },
                        },
                        reportId: report.id,
                        dataViewId: dataViewJs.report_data_view_id,
                    }
                )
            );

            reportDispatch(
                reportDataViewSetChartJsConfiguratorInitialSetupDone(
                    {
                        reportId: report.id,
                        dataViewId: dataViewJs.report_data_view_id,
                    }
                )
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refCanvas.current, dataViewJs.chartJsConfigurator?.initialSetupDone]);


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