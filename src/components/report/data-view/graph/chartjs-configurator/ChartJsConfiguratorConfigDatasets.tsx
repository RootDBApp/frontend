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

// @ts-ignore
import { ChartDataSets }                       from "chart.js";
import { Accordion, AccordionTab }             from "primereact/accordion";
import { ColorPicker, ColorPickerChangeEvent } from "primereact/colorpicker";
import React                                   from "react";

import TReportDataViewJs                      from "../../../../../types/TReportDataViewJs";
import * as RTReport                          from "../../../../../contexts/report/ReportContextProvider";
import { reportDataViewUpdateChartJsDataSet } from "../../../../../contexts/report/store/actions";


const ChartJsConfiguratorConfigDatasets: React.FC<{
    reportId: number,
    dataViewJs: TReportDataViewJs
}> = ({
          reportId,
          dataViewJs
      }): React.ReactElement => {

    const reportDispatch = RTReport.useDispatch();

    return (
        <Accordion>
            {dataViewJs.chartJs?.config.data?.datasets?.map((dataSet: ChartDataSets, index: number) => {

                    return (
                        <AccordionTab
                            header={dataSet.label}
                            key={`accordion-tab-dataset-${reportId}-${dataViewJs.report_data_view_id}-${index}`}
                        >
                            <ColorPicker
                                value={dataSet.borderColor}
                                onChange={(event: ColorPickerChangeEvent) => {
                                    reportDispatch(
                                        reportDataViewUpdateChartJsDataSet(
                                            {
                                                dataSet: {
                                                    ...dataSet,
                                                    borderColor: `#${event.value}`
                                                },
                                                dataSetIndex: index,
                                                reportId: reportId,
                                                dataViewId: dataViewJs.report_data_view_id,
                                            }
                                        )
                                    );
                                }}
                            />{dataSet.borderColor}
                        </AccordionTab>
                    );
                }
            )}
        </Accordion>
    );
}

export default ChartJsConfiguratorConfigDatasets;