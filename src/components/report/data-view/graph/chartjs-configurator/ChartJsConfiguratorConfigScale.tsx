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

import { CartesianScaleOptions }                      from "chart.js/dist/types";
import { Accordion, AccordionTab }                     from "primereact/accordion";
import { ColorPicker, ColorPickerChangeEvent }         from "primereact/colorpicker";
import { InputText }                                   from "primereact/inputtext";
import React                                           from "react";

import { getSurfaceBorder }                           from "../../../../../utils/commonJs";
import { ICallbackChartJsUpdateOptionsScalesOptions } from "../../../../../types/ICallBacks";
import { Checkbox, CheckboxChangeEvent }              from "primereact/checkbox";
import { t }                                          from "i18next";

const ChartJsConfiguratorConfigScale: React.FC<{
    scaleOptions: CartesianScaleOptions,
    updateOptionsScales: ICallbackChartJsUpdateOptionsScalesOptions
}> = ({
          scaleOptions,
          updateOptionsScales
      }): React.ReactElement => {

    return (
        <Accordion>
            <AccordionTab
                key={`scales_${scaleOptions.axis}`}
                header="Grid"
            >
                <div className="formgrid grid">
                    <div className="field col-12 md:col-6">
                        <ColorPicker
                            format="hex"
                            value={scaleOptions.grid.color as string}
                            onChange={(event: ColorPickerChangeEvent) => {
                                updateOptionsScales({
                                        ...scaleOptions,
                                        grid: {
                                            ...scaleOptions.grid,
                                            color: `#${event.target.value}`
                                        }
                                    }
                                );
                            }}
                        />
                        <InputText
                            keyfilter="hex"
                            maxLength={6}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                updateOptionsScales({
                                        ...scaleOptions,
                                        grid: {
                                            ...scaleOptions.grid,
                                            color: `#${event.target.value}`
                                        }
                                    }
                                );
                            }}
                            value={scaleOptions.grid.color ? (scaleOptions.grid.color as string).replace('#', '') : getSurfaceBorder()}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor={`scales_${scaleOptions.axis}_display`}>{t('report:dataview.chartjs_config.display')}</label>
                        <Checkbox
                            id={`scales_${scaleOptions.axis}_display`}
                            checked={scaleOptions.grid.display as boolean}
                            onChange={(event: CheckboxChangeEvent) => {

                                updateOptionsScales({
                                        ...scaleOptions,
                                        grid: {
                                            ...scaleOptions.grid,
                                            display: event.checked
                                        }
                                    }
                                );
                            }}
                        />
                    </div>
                </div>
            </AccordionTab>
        </Accordion>
    )
}

export default ChartJsConfiguratorConfigScale;