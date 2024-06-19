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

import React             from "react";
import { Button }        from "primereact/button";
import TReportDataViewJs from "../../../../../types/TReportDataViewJs";
import Chart             from "chart.js/auto";
import { ChartDataset }  from "chart.js";

// @ts-ignore
if (typeof JSON.decycle !== "function") {
// @ts-ignore
    JSON.decycle = function decycle(object, replacer) {
        "use strict";


        var objects = new WeakMap();     // object to path mappings

        return (function derez(value, path) {


            var old_path;   // The path of an earlier occurance of value
            // @ts-ignore
            var nu;         // The new object or array


            if (replacer !== undefined) {
                value = replacer(value);
            }


            if (
                typeof value === "object"
                && value !== null
                && !(value instanceof Boolean)
                && !(value instanceof Date)
                && !(value instanceof Number)
                && !(value instanceof RegExp)
                && !(value instanceof String)
            ) {


                old_path = objects.get(value);
                if (old_path !== undefined) {
                    return { $ref: old_path };
                }


                objects.set(value, path);


                if (Array.isArray(value)) {
                    nu = [];
                    value.forEach(function (element, i) {
                        nu[i] = derez(element, path + "[" + i + "]");
                    });
                } else {


                    nu = {};
                    Object.keys(value).forEach(function (name) {
                        // @ts-ignore
                        nu[name] = derez(
                            value[name],
                            path + "[" + JSON.stringify(name) + "]"
                        );
                    });
                }
                return nu;
            }
            return value;
        }(object, "$"));
    };
}

// @ts-ignore
if (typeof JSON.retrocycle !== "function") {
    // @ts-ignore
    JSON.retrocycle = function retrocycle($) {
        "use strict";

        var px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\(?:[\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;

        (function rez(value) {

            if (value && typeof value === "object") {
                if (Array.isArray(value)) {
                    value.forEach(function (element, i) {
                        if (typeof element === "object" && element !== null) {
                            var path = element.$ref;
                            if (typeof path === "string" && px.test(path)) {
                                value[i] = eval(path);
                            } else {
                                rez(element);
                            }
                        }
                    });
                } else {
                    Object.keys(value).forEach(function (name) {
                        var item = value[name];
                        if (typeof item === "object" && item !== null) {
                            var path = item.$ref;
                            if (typeof path === "string" && px.test(path)) {
                                value[name] = eval(path);
                            } else {
                                rez(item);
                            }
                        }
                    });
                }
            }
        }($));
        return $;
    };
}

const ChartJsConfiguratorConfig: React.FC<{
    dataViewJs: TReportDataViewJs
}> = ({dataViewJs}): React.ReactElement => {

    const [codeStringified, setCodeStringified] = React.useState<string>('');
    const [jsObject, setJsObject] = React.useState<Chart>();

    const [glopMsg, setGlopMsg]= React.useState<string>('');

    const [dataSets, setDataSets] = React.useState<Array<any>>([]);
    const [labels, setLabels] = React.useState<Array<any>>([]);

    // const refCanvasTest = React.useRef<HTMLCanvasElement>(null);

    return (
        <>
            <Button
                label="stringify code"
                onClick={() => {

                    setGlopMsg('starting stringify');
                    // setDataSets(dataViewJs.chartJs.config.data.datasets);
                    // setLabels(dataViewJs.chartJs.config.data.labels);
                    // @ts-ignore
                    setCodeStringified(JSON.stringify(JSON.decycle(dataViewJs.chartJs)));

                    console.log('=================================================================');
                    // console.log('=== dataViewJs.chartJs', dataViewJs.chartJs.config.data.datasets);
                    // console.log('=== dataSets', dataSets);
                    // console.log('=== labels', labels);
                    setGlopMsg('stringified');
                }}
            />

            <Button
                label="unstringify code"
                onClick={() => {

                    setGlopMsg('unstringifying');
                    // @ts-ignore
                    setJsObject(JSON.retrocycle(JSON.parse(codeStringified)) as Chart);

                    setGlopMsg('unstringified');
                }}
            />
            <Button label="test unstringified object"
                    onClick={() => {


                        if(jsObject && jsObject.config) {

                            console.log('=== ', jsObject);
                            jsObject.config.data.datasets = dataViewJs.chartJs.config.data.datasets;
                            jsObject.config.data.labels = dataViewJs.chartJs.config.data.labels;
                            const chartGlopiTest = new Chart(
                                // @ts-ignore
                                document.getElementById(`canvasGraph-${dataViewJs.report_data_view_id}`),
                                jsObject.config
                            );
                            chartGlopiTest.render();
                            console.log('=== ', chartGlopiTest);
                        }
                    }}
            />
            <hr/>
            <pre>{glopMsg}</pre>
            <hr/>
            <div className="canvas-container" style={{width: '400px', height: '400px'}}>
                <canvas
                    id={`canvasGraph-${dataViewJs.report_data_view_id}`}
                />
            </div>
        </>
    )
}

export default ChartJsConfiguratorConfig;