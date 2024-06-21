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

// import Chart                 from "chart.js/auto";
import * as React            from 'react';
import { TabPanel, TabView } from "primereact/tabview";

import { EAceEditorMode }             from "../../../../types/primereact/EAceEditorMode";
import { ICallbackSQLEditorOnChange } from "../../../../types/ICallBacks";
import TCallbackResponse              from "../../../../types/TCallbackResponse";
import CenteredLoading                from "../../../common/loading/CenteredLoading";
import ChartJsConfigurator            from "./chartjs-configurator/ChartJsConfigurator";
import TReportDataView                from "../../../../types/TReportDataView";

const CustomEditor = React.lazy(() => import('../../../common/CustomEditor'));

const DataViewGraphParamsJs: React.FC<{
    callBackResponse: TCallbackResponse,
    dataView: TReportDataView,
    onChangeCallback: ICallbackSQLEditorOnChange,
    reportId: number,
}> = ({
          callBackResponse,
          dataView,
          onChangeCallback,
          reportId,
      }): React.ReactElement => {


    // React.useEffect(() => {
    //     if (dataView.report_data_view_js.chartJs) {
    //         console.debug('----------------------------------------------------------');
    //         console.debug('datasets ->', (dataView.report_data_view_js.chartJs as Chart).config.data.datasets);
    //         console.debug('labels ->', (dataView.report_data_view_js.chartJs as Chart).config.data.labels);
    //     }
    // }, [dataView.report_data_view_js]);

    return (
        <ChartJsConfigurator
            reportId={reportId}
            dataViewJs={dataView.report_data_view_js}
        />
        // <TabView className="tab-view-chart-js-param-js">
        //     <TabPanel header="Configurator">
        //         <ChartJsConfigurator
        //             reportId={reportId}
        //             dataViewJs={dataView.report_data_view_js}
        //         />
        //     </TabPanel>
        //     <TabPanel header="Code">
        //
        //         <React.Suspense fallback={<CenteredLoading/>}>
        //
        //             <CustomEditor
        //                 saveCallbackResponse={callBackResponse}
        //                 height="100%"
        //                 id={'js_editor_code_data_view_' + dataView.id}
        //                 mode={EAceEditorMode.JS}
        //                 // onBlurCallback={(js_code: string) => {
        //                 //
        //                 //     onChangeCallback(js_code);
        //                 // }}
        //                 onSaveCallback={(js_code: string) => {
        //
        //                     onChangeCallback(js_code);
        //                 }}
        //                 onLoad={true}
        //                 resize="none"
        //                 value={dataView.report_data_view_js.js_code}
        //             />
        //         </React.Suspense>
        //     </TabPanel>
        // </TabView>
    )
}

export default DataViewGraphParamsJs;