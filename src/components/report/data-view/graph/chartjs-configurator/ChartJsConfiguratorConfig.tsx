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

import { CartesianScaleOptions, ChartOptions, } from "chart.js";
import { Accordion, AccordionTab }              from "primereact/accordion";
import React                                    from "react";

import TReportDataViewJs                                  from "../../../../../types/TReportDataViewJs";
import { reportDataViewUpdateChartJsConfiguratorOptions } from "../../../../../contexts/report/store/actions";
import * as RTReport                                      from "../../../../../contexts/report/ReportContextProvider";
import { Divider }                                        from "primereact/divider";
import CenteredLoading                                    from "../../../../common/loading/CenteredLoading";

const ChartJsConfiguratorConfigScale = React.lazy(() => import('./ChartJsConfiguratorConfigScale'));


const ChartJsConfiguratorConfig: React.FC<{
    reportId: number,
    dataViewJs: TReportDataViewJs
}> = ({
          reportId,
          dataViewJs
      }): React.ReactElement => {

    const reportDispatch = RTReport.useDispatch();

    const updateChartJsOptions = (chartOptions: ChartOptions) => {

        reportDispatch(
            reportDataViewUpdateChartJsConfiguratorOptions(
                {
                    chartOptions: chartOptions,
                    reportId: reportId,
                    dataViewId: dataViewJs.report_data_view_id,
                }
            )
        );
    }

    return (
        <Accordion>
            <AccordionTab
                key={1}
                header="Scales"
            >
                <div className="formgrid grid">
                    <div className="field col-12 md:col-6">
                        <Divider align="center">
                            X
                        </Divider>

                        <React.Suspense fallback={<CenteredLoading/>}>
                            <ChartJsConfiguratorConfigScale
                                scaleOptions={dataViewJs.chartJsConfigurator?.chartJsSetup.config.options.scales?.x as CartesianScaleOptions}
                                updateOptionsScales={(scaleOptions: CartesianScaleOptions) => {

                                    updateChartJsOptions({
                                            ...dataViewJs.chartJsConfigurator?.chartJsSetup.config.options,
                                            scales: {
                                                ...dataViewJs.chartJsConfigurator?.chartJsSetup.config.options.scales,
                                                x: scaleOptions
                                            },
                                        }
                                    )
                                }}
                            />
                        </React.Suspense>
                    </div>
                    <div className="field col-12 md:col-6">
                        <Divider align="center">
                            Y
                        </Divider>
                        <React.Suspense fallback={<CenteredLoading/>}>
                            <ChartJsConfiguratorConfigScale
                                scaleOptions={dataViewJs.chartJsConfigurator?.chartJsSetup.config.options.scales?.y as CartesianScaleOptions}
                                updateOptionsScales={(scaleOptions: CartesianScaleOptions) => {

                                    updateChartJsOptions({
                                            ...dataViewJs.chartJsConfigurator?.chartJsSetup.config.options,
                                            scales: {
                                                ...dataViewJs.chartJsConfigurator?.chartJsSetup.config.options.scales,
                                                y: scaleOptions
                                            },
                                        }
                                    )
                                }}
                            />
                        </React.Suspense>
                    </div>
                </div>
            </AccordionTab>
        </Accordion>
    )
}

export default ChartJsConfiguratorConfig;