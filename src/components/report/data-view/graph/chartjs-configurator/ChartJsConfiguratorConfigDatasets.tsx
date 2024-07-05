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

import { t }                                   from "i18next";
import { ChartDataset }                        from "chart.js";
import { Accordion, AccordionTab }             from "primereact/accordion";
import { ColorPicker, ColorPickerChangeEvent } from "primereact/colorpicker";
import { InputText }                           from "primereact/inputtext";
import React                                   from "react";

import TReportDataViewJs                                  from "../../../../../types/TReportDataViewJs";
import * as RTReport                                      from "../../../../../contexts/report/ReportContextProvider";
import { reportDataViewUpdateChartJsConfiguratorDataSet } from "../../../../../contexts/report/store/actions";
import CenteredLoading                                    from "../../../../common/loading/CenteredLoading";
import ChartJsConfiguratorConfigDatasetsBackgroundColor   from "./ChartJsConfiguratorConfigDatasetsBackgroundColor";

// const ChartJsConfiguratorConfigDatasetsBackgroundColor = React.lazy(() => import('./ChartJsConfiguratorConfigDatasetsBackgroundColor'));

const ChartJsConfiguratorConfigDatasets: React.FC<{
    reportId: number,
    dataViewJs: TReportDataViewJs
}> = ({
          reportId,
          dataViewJs
      }): React.ReactElement => {

    const reportDispatch = RTReport.useDispatch();

    const updateChartJsDataSet = (dataSet: ChartDataset, dataSetIndex: number) => {

        reportDispatch(
            reportDataViewUpdateChartJsConfiguratorDataSet(
                {
                    dataSet: dataSet,
                    dataSetIndex: dataSetIndex,
                    reportId: reportId,
                    dataViewId: dataViewJs.report_data_view_id,
                }
            )
        );
    }

    React.useEffect(() => {


    }, []);

    return (
        <Accordion>
            {dataViewJs.chartJsConfigurator?.chartJsSetup.config.data?.datasets?.map((dataSet: ChartDataset, dataSetIndex: number) => {

                    return (
                        <AccordionTab
                            header={dataSet.label}
                            key={`accordion-tab-dataset-${reportId}-${dataViewJs.report_data_view_id}-${dataSetIndex}`}
                        >
                            <div className="formgrid grid">
                                {/*Border color*/}
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="firstname6">{t('report:dataview.chartjs_config.border_color')}</label>
                                    <div className="surface-overlay appearance-none outline-none focus:border-primary w-full">
                                        <ColorPicker
                                            format="hex"
                                            value={(dataSet.borderColor as string) ?? 'ffffff'}
                                            onChange={(event: ColorPickerChangeEvent) => {
                                                updateChartJsDataSet({
                                                        ...dataSet,
                                                        borderColor: `#${event?.value}`
                                                    }
                                                    , dataSetIndex)
                                            }}
                                        />
                                        <InputText
                                            keyfilter="hex"
                                            maxLength={6}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                updateChartJsDataSet({
                                                        ...dataSet,
                                                        borderColor: `#${event.target.value}`
                                                    }
                                                    , dataSetIndex)
                                            }}
                                            value={dataSet.borderColor ? (dataSet.borderColor as string).replace('#', '') : 'ffffff'}
                                        />
                                    </div>
                                </div>
                                {/*Background color*/}
                                <div className="field col-12 md:col-6">
                                    <React.Suspense fallback={<CenteredLoading/>}>
                                        {Array.isArray(dataSet.backgroundColor)
                                            ?
                                            <Accordion>
                                                {dataViewJs.chartJsConfigurator?.chartJsSetup.config.data.labels.map((label: string, labelIndex: number) => {
                                                    return (
                                                        <AccordionTab
                                                            header={label}
                                                            key={`accordion-tab-dataset-background-color-${reportId}-${dataViewJs.report_data_view_id}-${dataSetIndex}-${labelIndex}`}
                                                        >
                                                            <ChartJsConfiguratorConfigDatasetsBackgroundColor
                                                                backgroundColor={((dataSet.backgroundColor as Array<string>)[labelIndex])
                                                                    ? (dataSet.backgroundColor as Array<string>).at(labelIndex) as string
                                                                    : 'ffffff'
                                                                }
                                                                backgroundColorIndex={labelIndex}
                                                                dataSet={dataSet}
                                                                updateChartJsDataSet={(dataSetUpdated: ChartDataset) => updateChartJsDataSet(dataSetUpdated, dataSetIndex)}
                                                            />
                                                        </AccordionTab>
                                                    );

                                                })}
                                            </Accordion>
                                            :
                                            <ChartJsConfiguratorConfigDatasetsBackgroundColor
                                                backgroundColor={dataSet.backgroundColor as string}
                                                backgroundColorIndex={0}
                                                dataSet={dataSet}
                                                updateChartJsDataSet={(dataSetUpdated: ChartDataset) => updateChartJsDataSet(dataSetUpdated, dataSetIndex)}
                                            />
                                        }
                                    </React.Suspense>

                                </div>
                            </div>
                        </AccordionTab>
                    );
                }
            )}
        </Accordion>
    );
}

export default ChartJsConfiguratorConfigDatasets;