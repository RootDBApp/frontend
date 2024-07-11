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

import { ChartOptions } from "chart.js";
import React            from "react";

import TReportDataViewJs                                  from "../../../../../types/TReportDataViewJs";
import { Accordion, AccordionTab }                        from "primereact/accordion";
import { ColorPicker, ColorPickerChangeEvent }            from "primereact/colorpicker";
import { InputText }                                      from "primereact/inputtext";
import { reportDataViewUpdateChartJsConfiguratorOptions } from "../../../../../contexts/report/store/actions";
import * as RTReport                                      from "../../../../../contexts/report/ReportContextProvider";
import { getSurfaceBorder, getTextColorSecondary }        from "../../../../../utils/commonJs";

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

    // Initialize some default configurations stuff
    React.useEffect(() => {

        if (dataViewJs.chartJsConfigurator?.chartJsSetup.config.options.scales?.x?.grid?.color === '') {
            updateChartJsOptions({
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
            });
        }

    }, [dataViewJs.chartJsConfigurator?.chartJsSetup.config.options.scales?.x?.grid?.color]);

    return (
        <Accordion>
            <AccordionTab
                key={1}
                header="Scales"
            >
                <div className="formgrid grid">
                    <div className="field col-12 md:col-6">
                        <ColorPicker
                            format="hex"
                            // value={(dataViewJs.chartJsConfigurator?.chartJsSetup?.config?.options?.scales?.x?.grid?.color as string) ?? getSurfaceBorder()}
                            value={(dataViewJs.chartJsConfigurator?.chartJsSetup?.config?.options?.scales?.x?.grid?.color as string) ?? "#e30059"}
                            onChange={(event: ColorPickerChangeEvent) => {
                                updateChartJsOptions({
                                        ...dataViewJs.chartJsConfigurator?.chartJsSetup.config.options,
                                        scales: {
                                            ...dataViewJs.chartJsConfigurator?.chartJsSetup.config.options.scales,
                                            x: {
                                                ...dataViewJs.chartJsConfigurator?.chartJsSetup.config.options.scales?.x,
                                                grid: {
                                                    ...dataViewJs.chartJsConfigurator?.chartJsSetup.config.options.scales?.x?.grid,
                                                    color: `#${event.target.value}`
                                                }
                                            },
                                        },
                                    }
                                )
                            }}
                        />
                        {/*<InputText*/}
                        {/*    keyfilter="hex"*/}
                        {/*    maxLength={6}*/}
                        {/*    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {*/}
                        {/*        updateChartJsOptions({*/}
                        {/*                borderColor: `#${event.target.value}`*/}
                        {/*            }*/}
                        {/*        )*/}
                        {/*    }}*/}
                        {/*    value={dataSet.borderColor ? (dataSet.borderColor as string).replace('#', '') : 'ffffff'}*/}
                        {/*/>*/}
                    </div>

                    <div className="field col-12 md:col-6">
                    </div>
                </div>
            </AccordionTab>
        </Accordion>
    )
}

export default ChartJsConfiguratorConfig;