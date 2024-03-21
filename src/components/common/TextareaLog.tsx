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