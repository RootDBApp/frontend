import { AxiosResponse }  from "axios";
import { ProgressBar }    from 'primereact/progressbar';
import * as React         from 'react';
import { useTranslation } from "react-i18next";

import apiUpdate                     from "../../services/apiUpdate";
import TUpdateResponse               from "../../types/TUpdateResponse";
import { Button }                    from "primereact/button";
import { EAPIEndPoint }              from "../../types/EAPIEndPoint";
import { apiSendRequest }            from "../../services/api";
import TUpdateLogLine                from "../../types/TUpdateLogLine";
import { context as apiDataContext } from "../../contexts/api_data/store/context";
import TVersionInfo                  from "../../types/TVersionsInfo";
import { EVersionType }              from "../../types/EVersionType";

const UpdateManager: React.FC = (): React.ReactElement => {

    const {t} = useTranslation('common');
    const {state: apiDataState} = React.useContext(apiDataContext);

    const [updateStarted, setUpdateStarted] = React.useState<boolean>(false);
    const [percentage, setPercentage] = React.useState<number>(0);
    const [logs, setLogs] = React.useState<Array<TUpdateLogLine>>([]);
    const [updateResponse, setUpdateResponse] = React.useState<TUpdateResponse>(
        {
            advancement_percentage: 0,
            latest_step_desc: '',
            logs: []
        }
    );
    const [logDisplay, setLogDisplay] = React.useState<string>('none');
    const [buttonDisabledStatus, setButtonDisabledStatus] = React.useState<boolean>(true);
    const interval = React.useRef();

    const versionsInfoLabel = React.useCallback(
        (versionInfo: TVersionInfo | undefined): React.ReactElement => {

            if (versionInfo === undefined) {
                return <></>
            }

            return (
                <span style={{display: "block"}} className="p-menuitem">
                    <span
                        className="p-menuitem-link p-disabled"
                        role="menuitem"
                        aria-disabled="true"
                    >
                        <i style={{marginRight: "1em"}}
                           className={`update-tooltip p-menuitem-icon pi pi-${versionInfo.update_available ? 'arrow-circle-up' : 'pi-check-circle'}`}/>
                        <span className="p-menuitem-text">
                            {versionInfo.update_available
                                ? <>v{`${versionInfo.version} to v${versionInfo.available_version}`}</>
                                : <>v{`${versionInfo.version} - ${t('settings:update.up_to_date')}`}</>
                            }
                        </span>
                    </span>
                </span>
            )
        },
        [t]
    );


    const displayValueTemplate = (percentage: number): React.ReactElement => {

        return (
            <React.Fragment>
                {percentage}/<b>100</b> | {updateResponse.latest_step_desc}
            </React.Fragment>
        );
    }

    const getUpdateLog = (): void => {

        apiUpdate.get('/update_logs')
            .then((response: AxiosResponse) => {

                const updateResponse: TUpdateResponse = response.data;
                setUpdateResponse(updateResponse);
                setPercentage(updateResponse.advancement_percentage);

                if (updateResponse.advancement_percentage >= 100) {

                    clearInterval(interval.current);
                    setUpdateStarted(false);
                }

            })
            .catch(() => {

                clearInterval(interval.current);
                setUpdateStarted(false);
            });
    }

    const startUpdate = (): void => {

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.START_UPDATE,
            formValues: apiDataState.versionsInfos,
            callbackSuccess: () => {

                setLogs([]);
                setUpdateStarted(true);
            },
            callbackError: (error) => {

                console.debug('error', error);
            }
        });
    }


    React.useEffect(() => {

        let disabled = true;

        apiDataState.versionsInfos.forEach((versionInfo: TVersionInfo) => {
            if (versionInfo.update_available) {
                disabled = false;
            }
        });

        setButtonDisabledStatus(disabled);

    }, [apiDataState.versionsInfos]);

    React.useEffect(() => {

            let logs2: Array<TUpdateLogLine> = [];
            const numLogLine = logs.length;
            for (const [lineNum, logLine] of updateResponse.logs.entries()) {

                logs2.push({line: lineNum + numLogLine, message: logLine});
            }

            setLogs(logs2);

        },
        [updateResponse.logs]);         // eslint-disable-line react-hooks/exhaustive-deps


    React.useEffect(() => {

        if (updateStarted) {
            setButtonDisabledStatus(true);

            // @ts-ignore
            interval.current = setInterval(() => {
                getUpdateLog();
            }, 1000);
        }

        return () => {
            if (interval.current) {

                clearInterval(interval.current);
                // @ts-ignore
                interval.current = null;
            }
        }
    }, [updateStarted]); // eslint-disable-line react-hooks/exhaustive-deps

    return (

        <div className="card">
            <div className="formgrid grid">

                <div className="field col-12 md:col-3">
                    <label>RootDB</label>
                    {versionsInfoLabel(
                        apiDataState.versionsInfos.find((versionInfo: TVersionInfo) => {
                            return versionInfo.type === EVersionType.rootdb;
                        }))}
                </div>

                <div className="field col-12 md:col-2">
                    <Button
                        type="button"
                        label="Update"
                        onClick={startUpdate}
                        disabled={buttonDisabledStatus}
                    />

                </div>

                <div className="field col-12 md:col-2">
                    <Button
                        type="button"
                        className="p-button-secondary"
                        onClick={() => {
                            setLogDisplay(logDisplay === 'none' ? '' : 'none')
                        }}
                    >
                        <i className={`pi ${logDisplay === 'none' ? 'pi-eye-slash' : 'pi-eye'} px-2`}/>
                        <span className="px-3">logs</span>
                    </Button>
                </div>


                <div className="field col-12">
                    <ProgressBar value={percentage} displayValueTemplate={displayValueTemplate}/>
                </div>

                <div className="field col-12">
                    <pre>
                        <div className="cli_output" style={{display: logDisplay}}>
                             {logs.map((log: TUpdateLogLine) => (
                                 <div key={log.line}>
                                     {log.message}<br/>
                                 </div>
                             ))}
                        </div>
                    </pre>
                </div>

            </div>
        </div>
    );
};

export default UpdateManager;