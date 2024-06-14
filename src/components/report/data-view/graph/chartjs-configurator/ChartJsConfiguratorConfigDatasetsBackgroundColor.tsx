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
import { ColorPicker, ColorPickerChangeEvent } from "primereact/colorpicker";
import { InputText }                           from "primereact/inputtext";
import React                                   from "react";

import { ICallbackChartJsUpdateDataSett } from "../../../../../types/ICallBacks";

const ChartJsConfiguratorConfigDatasetsBackgroundColor: React.FC<{
    backgroundColor: string,
    backgroundColorIndex: number,
    dataSet: ChartDataset,
    updateChartJsDataSet: ICallbackChartJsUpdateDataSett
}> = ({
          backgroundColor,
          backgroundColorIndex,
          dataSet,
          updateChartJsDataSet,
      }): React.ReactElement => {

    return (
        <div className="field col-12 md:col-6">
            <label htmlFor="firstname6">{t('report:dataview.chartjs_config.background_color')}</label>
            <div className="surface-overlay appearance-none outline-none focus:border-primary w-full">
                <ColorPicker
                    format="hex"
                    value={backgroundColor ?? 'ffffff'}
                    onChange={(event: ColorPickerChangeEvent) => {

                        if (Array.isArray(dataSet.backgroundColor)) {

                            updateChartJsDataSet({
                                    ...dataSet,
                                    backgroundColor: dataSet.backgroundColor.map((backgroundColorMap: string, backgroundColorIndexMap: number) => {

                                        if (backgroundColorIndex === backgroundColorIndexMap) {

                                            return `#${event?.value}`;
                                        }
                                        return backgroundColorMap;
                                    })
                                }
                            );
                        } else {

                            updateChartJsDataSet({
                                    ...dataSet,
                                    backgroundColor: `#${event?.value}`
                                }
                            );
                        }
                    }}
                />
                <InputText
                    keyfilter="hex"
                    maxLength={6}
                    // onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    //     updateChartJsDataSet({
                    //             ...dataSet,
                    //             backgroundColor: `#${event.target.value}`
                    //         } as ChartDataset
                    //         , dataSetIndex)
                    // }}
                    value={backgroundColor ? backgroundColor.replace('#', '') : 'ffffff'}
                />
            </div>
        </div>
    );
};

export default ChartJsConfiguratorConfigDatasetsBackgroundColor;