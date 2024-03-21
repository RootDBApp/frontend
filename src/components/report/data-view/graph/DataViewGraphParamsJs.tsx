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

import * as React from 'react';

import { EAceEditorMode }              from "../../../../types/primereact/EAceEditorMode";
import { ICallbackSQLEditorOnChange }  from "../../../../types/ICallBacks";
import TCallbackResponse               from "../../../../types/TCallbackResponse";
// import * as RTReport                   from "../../../../contexts/report/ReportContextProvider";
import CenteredLoading                 from "../../../common/loading/CenteredLoading";

const CustomEditor = React.lazy(() => import('../../../common/CustomEditor'));

const DataViewGraphParamsJs: React.FC<{
    callBackResponse: TCallbackResponse,
    dataViewId: number,
    jsCode: string,
    onChangeCallback: ICallbackSQLEditorOnChange,
    reportId: number,
}> = ({
          callBackResponse,
          dataViewId,
          jsCode,
          onChangeCallback,
          reportId,
      }): React.ReactElement => {

    // const reportDispatch = RTReport.useDispatch();

    return (
        <React.Suspense fallback={<CenteredLoading/>}>
            <CustomEditor
                saveCallbackResponse={callBackResponse}
                height="100%"
                id={'js_editor_code_data_view_' + dataViewId}
                mode={EAceEditorMode.JS}
                // onBlurCallback={(js_code: string) => {
                //
                //     onChangeCallback(js_code);
                // }}
                onSaveCallback={(js_code: string) => {

                    onChangeCallback(js_code);
                }}
                onLoad={true}
                resize="none"
                value={jsCode}

            />
        </React.Suspense>
    )
}

export default DataViewGraphParamsJs;