import { Card }           from "primereact/card";
import * as React         from 'react';
import { useTranslation } from "react-i18next";

import { ICallbackTextJsonFormOnChange } from "../../../../types/ICallBacks";
import TCallbackResponse                 from "../../../../types/TCallbackResponse";
import TSQLResultColumn                  from "../../../../types/TSQLResultColumn";
import TReportParameter                  from "../../../../types/TReportParameter";
import { Editor }                        from "primereact/editor";
import TDataViewTextForm                 from "../../../../types/TDataViewTextForm";
import { Message }                       from "primereact/message";
import ReportParametersAndColumnsBinder  from "../../../common/form/ReportParametersAndColumnsBinder";

const DataViewTextParamsForm: React.FC<{
    callBackResponse?: TCallbackResponse,
    config?: TDataViewTextForm,
    onChangeCallback: ICallbackTextJsonFormOnChange,
    columns?: TSQLResultColumn[],
    reportParameters?: TReportParameter[],
    className?: string,
}> = ({
          callBackResponse,
          config,
          onChangeCallback,
          className,
          reportParameters,
          columns
      }): React.ReactElement => {

    const {t} = useTranslation(['report']);

    const editorRef = React.useRef<Editor>(null);

    const [text, setText] = React.useState(config?.text || '');

    React.useEffect(() => {
        let timeoutId: NodeJS.Timeout | undefined;
        if (config?.text !== text) {
            timeoutId = setTimeout(() => {
                onChangeCallback({text: text || ''});
            }, 1000);
        }
        return () => clearTimeout(timeoutId);
    }, [config?.text, text, onChangeCallback]);

    const addToEditor = (textToAdd: string) => {
        if (editorRef.current) {
            const quill = editorRef.current.getQuill();
            const selection = quill.getSelection(true);
            quill.insertText(selection.index, textToAdd);
        }
    };

    return (
        <div className={className}>
            <Card
                title={t('report:dataview.text_view.form_title').toString()}
                className="flex flex-grow-1"
            >
                <Message
                    className="w-full justify-content-start"
                    severity="info"
                    text={(
                        <>
                            {t('report:dataview.text_view.placeholders').toString()}
                            <br/>
                            {t('report:dataview.text_view.run_sql').toString()}
                            <br/>
                            {t('report:dataview.text_view.add_on_click').toString()}
                        </>
                    )}
                />

                <ReportParametersAndColumnsBinder
                    reportParameters={reportParameters}
                    columns={columns?.map(c => c.name)}
                    onReportParameterClick={(parameterName: string) => addToEditor(`[${parameterName}]`)}
                    onColumnClick={(column: string) => addToEditor(`{${column}}`)}
                />

                <Editor
                    ref={editorRef}
                    className="flex flex-column flex-grow-1"
                    pt={{
                        content: {className: "flex-grow-1"}
                    }}
                    value={text}
                    onTextChange={(e) => {
                        // @ts-ignore
                        setText(e.htmlValue || '');
                    }}
                />
            </Card>
        </div>
    )
}

export default DataViewTextParamsForm;
