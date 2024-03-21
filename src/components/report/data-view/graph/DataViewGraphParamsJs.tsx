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