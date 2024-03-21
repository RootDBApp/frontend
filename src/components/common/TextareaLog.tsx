import { Button }         from "primereact/button";
import * as React         from "react";
import { useTranslation } from "react-i18next";

const TextareaLog: React.FC<{
    logs: string,
    clearLogsAction?: Function,
    cssClassName?: string,
    height?: string
}> = ({logs, cssClassName, clearLogsAction, height = "200px"}): React.ReactElement => {

    const {t} = useTranslation('common');
    const inputTextAreaRef = React.useRef<HTMLTextAreaElement>(null);
    const [currentHeight, setCurrentHeight] = React.useState(height);

    const scrollToBottom = () => {

        if (inputTextAreaRef.current) {

            inputTextAreaRef.current.scrollTop = inputTextAreaRef.current.scrollHeight;
        }
    }

    React.useEffect(() => {
        scrollToBottom();
    }, [logs]);

    function handleResize(event: React.MouseEvent<HTMLDivElement>) {

        const start = event.pageY;
        const textareaHeight = inputTextAreaRef.current?.offsetHeight || 0;

        document.onmousemove = function (ev) {

            const delta = ev.pageY - start;

            setCurrentHeight(Math.max(32, textareaHeight + delta) + 'px');

            return false;
        };

        document.onmouseup = function () {

            document.onmousemove = null;
            document.onmouseup = null;
        }
    }

    return (
        <div className="grid textarea-log">
            <div className="col">
                <textarea
                    ref={inputTextAreaRef}
                    className={`p-inputtextarea textarea-code-log ${cssClassName}`}
                    value={logs}
                    readOnly
                    style={{ height: currentHeight }}
                    // autoResize={false}
                />
                <div className="textarea-resize-handler" onMouseDown={(event => handleResize(event))}/>
            </div>
            <div className="col" style={{maxWidth: '2.8rem'}}>
                <Button
                    type="button"
                    icon="pi pi-trash"
                    className="p-button-outlined"
                    tooltip={t('common:clear').toString()}
                    tooltipOptions={{position: 'left'}}
                    onClick={() => clearLogsAction && clearLogsAction()}
                />
            </div>
        </div>
    );
}

export default TextareaLog;