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
import { OverlayPanel }   from "primereact/overlaypanel";
import * as React         from 'react';
import AceEditor          from 'react-ace';
import { useTranslation } from "react-i18next";
import { useLocation }    from "react-router-dom";


import 'ace-builds/webpack-resolver'
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-terminal";
import 'ace-builds/src-min-noconflict/ext-searchbox';

import {
    addCompleter,
    setCompleters,
    snippetCompleter,
    textCompleter,
    keyWordCompleter
}              from 'ace-builds/src-noconflict/ext-language_tools';
import { Ace } from "ace-builds";

import { context as preferencesContext }                            from "../../contexts/preferences/store/context";
import EditorPreferencesForm                                        from "../settings/EditorPreferencesForm";
import TCallbackResponse                                            from "../../types/TCallbackResponse";
import { ECallbackStatus }                                          from "../../types/ECallbackStatus";
import { ICallbackSQLEditorOnChange }                               from "../../types/ICallBacks";
import { EAceEditorMode }                                           from "../../types/primereact/EAceEditorMode";
import { sleep }                                                    from "../../utils/tools";
import { EAceEditorButton }                                         from "../../types/primereact/EAceEditorButton";
import { jsHelpers }                                                from "../../utils/auto-complete/jsHelpers";
import TReportParameter                                             from "../../types/TReportParameter";
import { getConnectorCompletions }                                  from "../../contexts/api_data/store/actions";
import apiDataContext                                               from "../../contexts/api_data/store/context";
import TConnectorCompletions                                        from "../../types/TConnectorCompletions";
import { useReportStateReportInstanceDataViewInstanceFromLocation } from "../../contexts/report/ReportContextProvider";
import FullScreenDialog                                             from "./FullScreenDialog";
import { TAceCompletion }                                           from "../../types/TAceCompletion";
import { Badge }                                                    from "primereact/badge";

const CustomEditor: React.FC<{
    id: string,
    runCallbackResponse?: TCallbackResponse,
    saveCallbackResponse?: TCallbackResponse,
    activeButtons?: Array<EAceEditorButton>
    classNameAce?: string,
    confConnectorId?: number,
    displayButtons?: boolean,
    height?: string,
    isInvalid?: boolean,
    mode?: EAceEditorMode,
    onBlurCallback?: CallableFunction,
    onChangeCallback?: CallableFunction,
    onCloseCallback?: CallableFunction,
    onCompletionCallback?: CallableFunction,
    onExecuteCallback?: ICallbackSQLEditorOnChange,
    onSaveCallback?: ICallbackSQLEditorOnChange,
    onLoad?: boolean,
    refreshCompletion?: boolean
    resize?: string,
    resizeHandleTop?: boolean,
    value: string | undefined,
    width?: string,
    notification?: React.ReactNode,
    enableAutoComplete?: boolean
}> = ({
          runCallbackResponse,
          saveCallbackResponse,
          id,
          activeButtons = [EAceEditorButton.SAVE, EAceEditorButton.AUTO_SAVE],
          classNameAce,
          confConnectorId,
          displayButtons = true,
          height = "",
          isInvalid = false,
          mode = EAceEditorMode.MYSQL,
          onBlurCallback,
          onChangeCallback,
          onCloseCallback,
          onCompletionCallback,
          onExecuteCallback,
          onSaveCallback,
          onLoad = true,
          refreshCompletion = false,
          resize = 'vertical',
          resizeHandleTop = false,
          value,
          width = "",
          notification,
          enableAutoComplete = true
      }): React.ReactElement => {

    const {t} = useTranslation('common');

    const {preferencesState} = React.useContext(preferencesContext);
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);

    const reportState = useReportStateReportInstanceDataViewInstanceFromLocation(useLocation().pathname);

    const [cursorPosition, setCursorPosition] = React.useState<Ace.Point>({row: 0, column: 0});
    const [focused, setFocused] = React.useState(false);
    const [fullScreen, setFullScreen] = React.useState(false);
    const [saveButtonDisabled, setSaveButtonDisabled] = React.useState<boolean>(false);
    const [saveButtonVariant, setSaveButtonVariant] = React.useState<string>('p-button-primary');
    const [runButtonDisabled, setRunButtonDisabled] = React.useState<boolean>(false);
    const [runButtonVariant, setRunButtonVariant] = React.useState<string>('p-button-success');
    const [currentValue, setCurrentValue] = React.useState<string | undefined>(value);
    const [queriesToExecute, setQueriesToExecute] = React.useState<string>();
    const [queriesToSave, setQueriesToSave] = React.useState<string>();
    const [currentHeight, setCurrentHeight] = React.useState<string | undefined>(height);
    const [heightBeforeFullScreen, setHeightBeforeFullScreen] = React.useState<string | undefined>(height);
    const [dbHelpersTryCounter, setDbHelpersTryCounter] = React.useState<number>(0);
    const [allHelpers, setAllHelpers] = React.useState<Array<Ace.Completion>>([]);
    const [dbHelpersInitialized, setDbHelpersInitialized] = React.useState<boolean>(false);
    const [jsHelpersInitialized, setJsHelpersInitialized] = React.useState<boolean>(false);
    const [changesNotSaved, setChangesNotSaved] = React.useState<boolean>(false);

    const overlayPanelRef = React.useRef<OverlayPanel>(null);
    const textareaRef = React.useRef<AceEditor>(null);

    async function resizeAfter100ms(editorInstance: Ace.Editor) {

        await sleep(100);
        editorInstance.resize();
    }

    function handleResize(event: React.MouseEvent<HTMLDivElement>) {

        const start = event.pageY;
        const textareaHeight = textareaRef.current?.refEditor.offsetHeight || 0;

        document.onmousemove = function (ev) {

            const delta = ev.pageY - start;

            setCurrentHeight(Math.max(32, resizeHandleTop ? textareaHeight - delta : textareaHeight + delta) + 'px');
            textareaRef.current?.editor.resize(true);

            return false;
        };

        document.onmouseup = function () {

            document.onmousemove = null;
            document.onmouseup = null;
        }
    }

    const handleBlur = (value: string): void => {

        if (onBlurCallback) {

            onBlurCallback(value || '')
        }
    };

    const handleChange = (value: string): void => {

        setCurrentValue(value || '');
        if (onChangeCallback) {

            onChangeCallback(value || '')
        }
    };

    const handleExec = React.useCallback((value: string): void => {

        if (onExecuteCallback) {

            setRunButtonDisabled(true);
            onExecuteCallback(value || '');
        }
    }, [onExecuteCallback]);

    const handleSave = React.useCallback((value: string): void => {

        if (onSaveCallback) {

            setSaveButtonDisabled(true);
            onSaveCallback(value || '');
        }
    }, [onSaveCallback]);

    const handleRefreshAutoComplete = (confConnectorIdToUse: number): void => {

        setAllHelpers([]);
        apiDataDispatch(getConnectorCompletions(confConnectorIdToUse));
        setDbHelpersTryCounter(1);
    }

    // Update current value.
    React.useEffect(() => {

        setCurrentValue(value || '');
    }, [value]);

    React.useEffect(() => {
        setChangesNotSaved((currentValue || '') !== (value || ''))
    }, [currentValue, value]);

    // queries can't be passed to AceEditor commands, the values are not updated
    React.useEffect(() => {
        if (queriesToExecute) {
            handleExec(queriesToExecute);
            setQueriesToExecute(undefined);
        }
    }, [queriesToExecute, handleExec]);

    React.useEffect(() => {
        if (queriesToSave) {
            handleSave(queriesToSave);
            setQueriesToSave(undefined);
        }
    }, [queriesToSave, handleSave]);

    // Handle save button states.
    React.useEffect(() => {

        switch (saveCallbackResponse?.status) {

            case ECallbackStatus.ACTION_OK:

                setSaveButtonDisabled(false);
                setSaveButtonVariant('p-button-success');
                setTimeout(() => {
                    setSaveButtonVariant('p-button-metric');
                }, 2000)
                break;

            case ECallbackStatus.ACTION_KO:

                setSaveButtonDisabled(false);
                setSaveButtonVariant('p-button-danger');
                setTimeout(() => {
                    setSaveButtonVariant('p-button-metric');
                }, 2000)
                break;
        }

    }, [saveCallbackResponse]);

    // Handle run button states.
    React.useEffect(() => {

        switch (runCallbackResponse?.status) {

            case ECallbackStatus.ACTION_OK:

                setRunButtonDisabled(false);
                setRunButtonVariant('p-button-success');
                setTimeout(() => {
                    setRunButtonVariant('p-button-metric');
                }, 2000)
                break;

            case ECallbackStatus.ACTION_KO:

                setRunButtonDisabled(false);
                setRunButtonVariant('p-button-danger');
                setTimeout(() => {
                    setRunButtonVariant('p-button-metric');
                }, 2000)
                break;
        }

    }, [runCallbackResponse]);

    // Completer initialization.
    //
    // DB helpers.
    React.useEffect(() => {

        if ((!dbHelpersInitialized && !reportState?.instance?.isLoading && mode === EAceEditorMode.MYSQL && confConnectorId)
            ||
            (!dbHelpersInitialized && !reportState?.instance?.isLoading && mode === EAceEditorMode.MYSQL && reportState.report && reportState.report.conf_connector_id)
            ||
            refreshCompletion) {

            const confConnectorIdToUse = Number(confConnectorId ? confConnectorId : reportState.report?.conf_connector_id);

            const connectorCompletionsFound = apiDataState.connectorCompletions.find((connectorCompletions: TConnectorCompletions) => {
                return connectorCompletions.connector_id === confConnectorIdToUse
            });

            if (confConnectorIdToUse > 0 && dbHelpersTryCounter < 1
                && !connectorCompletionsFound
                && !apiDataState.connectorCompletionsLoading) {

                handleRefreshAutoComplete(confConnectorIdToUse);
            } else if (
                connectorCompletionsFound
                && connectorCompletionsFound.completions.length === 0
                && dbHelpersTryCounter < 1
                && !apiDataState.connectorCompletionsLoading
            ) {

                handleRefreshAutoComplete(confConnectorIdToUse);
            } else if (connectorCompletionsFound && connectorCompletionsFound.completions.length > 0) {

                const helpersToAdd: Array<Ace.Completion> = allHelpers;
                helpersToAdd.push(...connectorCompletionsFound.completions);
                setAllHelpers(helpersToAdd);
                setDbHelpersTryCounter(0);
                setDbHelpersInitialized(true);
                if (onCompletionCallback) {

                    onCompletionCallback();
                }
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        apiDataDispatch,
        apiDataState.connectorCompletionsLoading,
        apiDataState.connectorCompletions,
        confConnectorId,
        id,
        mode,
        refreshCompletion,
        reportState?.instance,
        reportState?.report,
        reportState?.report?.conf_connector_id,
    ]);

    // JS helpers.
    React.useEffect(() => {

        if (!jsHelpersInitialized && mode === EAceEditorMode.JS) {

            const helpersToAdd: Array<Ace.Completion> = allHelpers;
            helpersToAdd.push(...jsHelpers);
            setAllHelpers(helpersToAdd);
            setJsHelpersInitialized(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    // Report parameters helpers.
    //
    React.useEffect(() => {

        if (!reportState?.instance?.isLoading && reportState.report && reportState.report.parameters) {
            // Remove all report parameters helpers for this report. (to handle live update of report parameters)
            const helpersToAdd: Array<Ace.Completion> = allHelpers.filter((completion: TAceCompletion) => {
                return completion.name !== `reportParameterHelper_${reportState.report?.id}`
            });

            const reportParametersCompletions = reportState.report.parameters.map((reportParameter: TReportParameter) => {
                return {
                    name: `reportParameterHelper_${reportState.report?.id}`,
                    value: `${reportParameter.variable_name}`,
                    score: 100,
                    caption: '',
                    meta: `report parameter @${reportParameter.variable_name}`
                }
            });

            helpersToAdd.push(...reportParametersCompletions);
            setAllHelpers(helpersToAdd);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, reportState?.instance, reportState?.report]);

    // Handle shortcuts for full screen, exec
    //
    React.useEffect(() => {

        function handleRunShortcut(event: KeyboardEvent): void {

            const {
                altKey,
                shiftKey,
                code,
            } = event;

            // ALT + SHIFT + V
            if (focused && code === 'KeyV' && altKey && shiftKey) {

                event.preventDefault();
                setFullScreen(!fullScreen)
            }
            // ALT + SHIFT + R
            if (focused && code === 'KeyR' && altKey && shiftKey) {

                event.preventDefault();
                setFullScreen(false)
            }
        }

        // Bind the Event listener
        document.addEventListener("keydown", handleRunShortcut);
        return () => {

            // Unbind the event listener on clean up
            document.removeEventListener("keydown", handleRunShortcut);
        };
    }, [focused, fullScreen]);

    React.useEffect(() => {
        if (fullScreen) {
            setHeightBeforeFullScreen(currentHeight)
            setCurrentHeight('100vh');
        } else {
            setHeightBeforeFullScreen(undefined);
            setCurrentHeight(heightBeforeFullScreen);
        }
        // trigger only when fullscreen changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fullScreen])

    return (
        <FullScreenDialog
            opened={fullScreen}
            onClose={() => setFullScreen(false)}
        >
            <div className={`custom-editor flex flex-column ${isInvalid ? 'custom-editor-invalid' : ''}`}>
                {displayButtons &&
                    <div className="custom-editor-actions">

                        {fullScreen ? (
                            <Button
                                type="button"
                                icon="pi pi-window-minimize"
                                className="p-button-outlined"
                                tooltip={t('common:editor.minimize').toString()}
                                tooltipOptions={{position: 'left'}}
                                onClick={() => setFullScreen(false)}
                            />
                        ) : (
                            <Button
                                type="button"
                                icon="pi pi-window-maximize"
                                className="p-button-outlined"
                                tooltip={t('common:editor.maximize').toString()}
                                tooltipOptions={{position: 'left'}}
                                onClick={() => setFullScreen(true)}
                            />
                        )}

                        {onCloseCallback && !fullScreen &&
                            <Button
                                type="button"
                                icon="pi pi-times"
                                className="p-button-danger"
                                tooltip={t('common:close').toString()}
                                tooltipOptions={{position: 'left'}}
                                onClick={() => onCloseCallback()}
                            />
                        }

                        <Button
                            type="button"
                            icon="pi pi-cog"
                            className="p-button-outlined"
                            aria-controls="overlay-report-editor-preferences"
                            aria-haspopup
                            tooltip={t('settings:editor_preferences.title').toString()}
                            tooltipOptions={{position: 'left'}}
                            onClick={(event) => overlayPanelRef?.current?.toggle(event, event.target)}
                        />
                        <OverlayPanel
                            ref={overlayPanelRef}
                            id="overlay-report-editor-preferences"
                            className=""
                            style={{maxWidth: '700px'}}
                        >
                            <EditorPreferencesForm/>
                        </OverlayPanel>

                        {activeButtons?.find(buttonEnum => buttonEnum === EAceEditorButton.RUN) !== undefined &&
                            <Button
                                type="button"
                                icon="pi pi-play"
                                className={`${runButtonVariant} `}
                                disabled={runButtonDisabled}
                                tooltip={t('common:run').toString()}
                                tooltipOptions={{position: 'left'}}
                                onClick={() => {
                                    handleExec(String(currentValue));
                                    handleSave(String(currentValue));
                                    setFullScreen(false);
                                }}
                            />
                        }

                        {changesNotSaved &&
                            <div className="flex align-items-center">
                                <Badge severity="danger" value={t('common:editor.not-saved').toString()} className="mr-2"></Badge>
                                <Button
                                    type="button"
                                    icon="pi pi-save"
                                    className={`${saveButtonVariant}`}
                                    disabled={saveButtonDisabled}
                                    tooltip={t('common:form.save').toString()}
                                    tooltipOptions={{position: 'left'}}
                                    onClick={() => handleSave(String(currentValue))}
                                />
                            </div>
                        }
                        {!!notification && (
                            <div className="notification">
                                {notification}
                            </div>
                        )}
                    </div>
                }

                {!fullScreen && resize === 'vertical' && resizeHandleTop && (
                    <div className="textarea-resize-handler" onMouseDown={(event => handleResize(event))}/>
                )}

                <AceEditor
                    enableBasicAutocompletion={false}
                    enableLiveAutocompletion={false}
                    className={`custom-editor flex-grow-1 ${classNameAce || ''}`}
                    commands={
                        [
                            {
                                name: 'Execute all queries',
                                bindKey: {win: 'Ctrl-enter', mac: 'Cmd-enter'},
                                exec: (editor: Ace.Editor) => {
                                    setQueriesToExecute(editor.getValue());
                                    setQueriesToSave(editor.getValue());
                                    setFullScreen(false);
                                },
                            },
                            {
                                name: 'Execute selected query',
                                bindKey: {win: 'Ctrl-shift-enter', mac: 'Cmd-shift-enter'},
                                exec: (editor: Ace.Editor) => {
                                    setQueriesToSave(editor.getValue());
                                    setQueriesToExecute(editor.getSelectedText() || editor.getValue());
                                    setFullScreen(false);
                                },
                            }
                        ]
                    }
                    editorProps={{$blockScrolling: true}}
                    focus={focused}
                    fontSize={Number(preferencesState.editorPreferences.fontSize)}
                    height={currentHeight}
                    highlightActiveLine={Boolean(preferencesState.editorPreferences.highlightActiveLine)}
                    mode={mode}
                    name={id}
                    onBlur={(event, editor) => {
                        setFocused(false);
                        if (editor) {
                            handleBlur(editor.getValue());
                        }
                    }}
                    onChange={(value) => handleChange(value)}
                    onCursorChange={(selection) => setCursorPosition(selection.getCursor())}
                    onFocus={
                        () => {
                            setFocused(true);
                            // Re-add default completers...
                            setCompleters([snippetCompleter, textCompleter, keyWordCompleter]);
                            // ... and add our custom one, and filter on current conf-connector/report - depending on where the editor is.
                            addCompleter({
                                getCompletions: function (editor: Ace.Editor, session: Ace.EditSession, pos: Ace.Point, prefix: string, callback: Ace.CompleterCallback) {
                                    const confConnectorIdToUse = Number(confConnectorId ? confConnectorId : reportState.report?.conf_connector_id);

                                    console.debug('completer - allHelpers for [' + id + ']', allHelpers);
                                    const completers = allHelpers.filter((completion: TAceCompletion) => {

                                        // Javascript mode, always within a report.
                                        // @ts-ignore
                                        if (session.getMode().$id === 'ace/mode/javascript') {

                                            return completion.name === 'jsHelper' || completion.name === `reportParameterHelper_${reportState.report?.id}`;

                                        } // SQL mode, within a report
                                        else if (reportState.report && reportState.report?.id > 0) {

                                            return completion.name === `dbHelper_${confConnectorIdToUse}` || completion.name === `reportParameterHelper_${reportState.report?.id}`;
                                        }

                                        // SQL mode, outside a report.
                                        return completion.name === `dbHelper_${confConnectorIdToUse}`;

                                    });
                                    callback(null, completers);
                                },
                            });
                        }
                    }
                    onLoad={editorInstance => {
                        editorInstance.gotoLine(cursorPosition.row + 1, cursorPosition.column, false);
                        if (onLoad) {
                            // @ts-ignore
                            editorInstance.commands.bindKey("Ctrl-D", "togglecomment")
                            editorInstance.container.style.resize = resize;
                            document.addEventListener("mouseup", () => (editorInstance.resize()));
                            document.addEventListener("upEventResizeAceEditor", () => (resizeAfter100ms(editorInstance).then()));
                        }
                    }}
                    ref={textareaRef}
                    setOptions={{
                        autoScrollEditorIntoView: true,
                        enableBasicAutocompletion: enableAutoComplete,
                        enableLiveAutocompletion: enableAutoComplete,
                        enableSnippets: enableAutoComplete,
                        showLineNumbers: Boolean(preferencesState.editorPreferences.showLineNumbers),
                    }}
                    showPrintMargin={Boolean(preferencesState.editorPreferences.showPrintMargin)}
                    tabSize={Number(preferencesState.editorPreferences.tabSize)}
                    theme={preferencesState.editorPreferences.theme}
                    value={currentValue || ''}
                    width={width}
                />
                {!fullScreen && resize === 'vertical' && !resizeHandleTop && (
                    <div className="textarea-resize-handler" onMouseDown={(event => handleResize(event))}/>
                )}
            </div>
        </FullScreenDialog>
    )
};

export default CustomEditor;