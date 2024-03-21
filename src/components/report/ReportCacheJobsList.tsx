import { Accordion, AccordionTab } from "primereact/accordion";
import * as React                  from "react";
import { useTranslation }          from "react-i18next";

import { apiSendRequest }     from "../../services/api";
import { EAPIEndPoint }       from "../../types/EAPIEndPoint";
import { TCacheJob }          from "../../types/TCacheJob";
import ReportCacheJobForm     from "./ReportCacheJobForm";
import { ECacheJobFrequency } from "../../types/ECacheJobFrequency";
import { EWeekDay }           from "../../types/EWeekDay";
import round                  from "lodash.round";
import { useReportState }     from "../../contexts/report/ReportContextProvider";
import TReportParameter       from "../../types/TReportParameter";
import EchoClient             from "../../services/EchoClient";
import TCacheJobUpdated       from "../../types/TCacheJobUpdated";

const ReportCacheJobsList: React.FC<{ reportId: number, }> = ({reportId}): React.ReactElement => {

    const {t} = useTranslation(['common', 'report', 'widget']);
    const reportState = useReportState(reportId);

    const [cacheJobs, setCacheJobs] = React.useState<Array<TCacheJob>>([]);
    const [wsListenerActivated, setWsListenerActivated] = React.useState<boolean>(false);

    const initializeCacheJobParameterSetConfigs = (cacheJob: TCacheJob): Array<TCacheJobParameterSetConfig> => {

        const cacheJobParameterSetConfigs = cacheJob.cache_job_parameter_set_configs;

        if (!reportState.report?.parameters) {
            return [];
        }

        for (const [, parameter] of reportState.report.parameters.entries()) {

            const cacheJobParameterSetConfigFound = cacheJobParameterSetConfigs.find(
                (cacheJobParameterSetConfig) => cacheJobParameterSetConfig.report_parameter_id === parameter.id
            );

            if (cacheJobParameterSetConfigFound === undefined) {

                const cacheJobParameterSetConfig: TCacheJobParameterSetConfig = {
                    'id': 0,
                    'cache_job_id': cacheJob.id,
                    'report_parameter_id': parameter.id,
                    'value': '',
                    'date_start_from_values': {'values': []},
                    'select_values': {'values': []},
                    'multi_select_values': {'values': []},
                }

                cacheJobParameterSetConfigs.push(cacheJobParameterSetConfig);
            }
        }

        return cacheJobParameterSetConfigs;
    }

    // Not using apiCache context because we need to list all service messages from all organization user have access.
    const getCacheJobs = (): void => {

        setCacheJobs([]);

        apiSendRequest({
            method: 'GET',
            endPoint: EAPIEndPoint.CACHE_JOB,
            urlParameters: [{key: 'report-id', value: reportId}],
            callbackSuccess: (cacheJobsResult: Array<TCacheJob>) => {

                setCacheJobs(cacheJobsResult.map((cacheJob: TCacheJob) => {

                    let cacheJobParameterSetConfigs = cacheJob.cache_job_parameter_set_configs;

                    if (cacheJob.cache_job_parameter_set_configs.length > 0) {

                        // Convert json string from table field to object.
                        cacheJobParameterSetConfigs = cacheJob.cache_job_parameter_set_configs.map(
                            (cacheJobParameterSetConfig: TCacheJobParameterSetConfig) => {

                                cacheJobParameterSetConfig.date_start_from_values = JSON.parse(String(cacheJobParameterSetConfig.date_start_from_values));
                                cacheJobParameterSetConfig.select_values = JSON.parse(String(cacheJobParameterSetConfig.select_values));
                                cacheJobParameterSetConfig.multi_select_values = JSON.parse(String(cacheJobParameterSetConfig.multi_select_values));
                                return cacheJobParameterSetConfig;
                            }
                        )
                    }

                    if (cacheJob.cache_job_parameter_set_configs.length !== reportState.report?.parameters?.length) {

                        cacheJobParameterSetConfigs = initializeCacheJobParameterSetConfigs(cacheJob);
                    }

                    return {
                        ...cacheJob,
                        last_run: cacheJob.last_run !== null ? new Date(cacheJob.last_run) : null,
                        at_time: cacheJob.at_time !== null ? new Date(cacheJob.at_time) : null,
                        cache_job_parameter_set_configs: cacheJobParameterSetConfigs,
                    };
                }));
            }
        });
    }

    React.useEffect(() => {

        getCacheJobs();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {

        if (cacheJobs.length > 0 && !wsListenerActivated) {

            setWsListenerActivated(true);
            console.debug('ws - listen to CacheJobUpdated');
            EchoClient
                .channel('organization.' + reportState.report?.organization_id)
                .listen('CacheJobUpdated', (cacheJobUpdated: TCacheJobUpdated) => {

                        console.debug('ws - CacheJobUpdated', cacheJobUpdated);
                        setCacheJobs(previousCacheJobs => previousCacheJobs.map((cacheJob: TCacheJob) => {

                                if (cacheJob.id === cacheJobUpdated.id) {

                                    return {
                                        ...cacheJob,
                                        running: cacheJobUpdated.running,
                                        last_run: cacheJobUpdated.last_run !== null ? new Date(cacheJobUpdated.last_run) : null,
                                        last_run_duration: cacheJobUpdated.last_run_duration,
                                        last_num_parameter_sets: cacheJobUpdated.last_num_parameter_sets,
                                        last_cache_size: cacheJobUpdated.last_cache_size,
                                    }
                                }

                                return cacheJob;
                            })
                        )
                    }
                )
        }

    }, [cacheJobs, reportState.report?.organization_id, wsListenerActivated]);

    React.useEffect(() => {

        return () => {

            console.debug('ws - stop listening to CacheJobUpdated');
            EchoClient
                .channel('organization.' + reportState.report?.organization_id)
                .stopListening('CacheJobUpdated');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (<>
        <Accordion activeIndex={0}>
            {cacheJobs.map((cacheJob: TCacheJob) => (
                <AccordionTab
                    key={cacheJob.id}
                    tabIndex={cacheJob.id}
                    headerTemplate={
                        <div className="flex overflow-hidden" style={{width: '100%'}}>
                            <div className="flex-none flex align-items-center justify-content-start">
                                {cacheJob.activated
                                    ? <i className="pi pi-circle-fill mr-2" style={{color: 'green'}}/>
                                    : <i className="pi pi-circle-fill mr-2" style={{color: 'grey'}}/>
                                }
                                <span>#{cacheJob.id}&nbsp;-&nbsp;{t('widget:dropdown_cache_job_frequency.' + cacheJob.frequency).toString()}</span>
                            </div>
                            <div className="flex-grow-1 flex"/>
                            <div className="flex-none flex align-items-center justify-content-end  font-medium text-xs">
                                {(cacheJob.last_run !== null && !cacheJob.running) &&
                                    <>
                                        <i className="pi pi-clock mr-2"/>
                                        <span>
                                            {cacheJob.last_run.toDateString()}
                                            &nbsp; {t('common:at').toString()} &nbsp;
                                            {cacheJob.last_run.getHours().toString()}:{cacheJob.last_run.getMinutes().toString()}
                                        </span>
                                        &nbsp;(&nbsp;<span className="date-view-elapsed-time">{round(cacheJob.last_run_duration, 2)} s )</span>
                                    </>
                                }
                                {cacheJob.running &&
                                    <>
                                        <i className="pi pi-spin pi-spinner mr-2"/>
                                        <span>{t('report:form.caching_in_progress').toString()}</span>
                                    </>
                                }

                            </div>
                        </div>
                    }
                >
                    <ReportCacheJobForm
                        cacheJob={cacheJob}
                        onUpdate={() => getCacheJobs()}
                        report={reportState.report}
                    />
                </AccordionTab>
            ))}
            {/*I doubt someone will create one day 9999 users.*/}
            <AccordionTab
                key={9999}
                tabIndex={9999}
                header={(
                    <span>
                        <i className="pi pi-plus mr-3"/> {t('report:form.add_cache_job').toString()}
                    </span>
                )}
                headerClassName="accordion-new-directory"
                contentClassName="accordion-new-directory-content"
            >
                <ReportCacheJobForm
                    cacheJob={{
                        id: 0,
                        report_id: reportId,
                        frequency: ECacheJobFrequency.DAILY_AT,
                        at_minute: 1,
                        at_time: new Date(),
                        at_weekday: EWeekDay.MONDAY,
                        at_day: 1,
                        ttl: 86400,
                        last_run: new Date(),
                        last_run_duration: 0,
                        last_num_parameter_sets: 0,
                        last_cache_size: '',
                        activated: true,
                        running: false,
                        cache_job_parameter_set_configs: reportState.report?.parameters?.map(
                            (parameter: TReportParameter) => {
                                return {
                                    'id': 0,
                                    'cache_job_id': 0,
                                    'report_parameter_id': parameter.id,
                                    'value': '',
                                    'date_start_from_values': {'values': []},
                                    'select_values': {'values': []},
                                    'multi_select_values': {'values': []},
                                }
                            }
                        ) ?? []
                    }}
                    isNewCacheJob
                    onUpdate={() => getCacheJobs()}
                    report={reportState.report}
                />
            </AccordionTab>
        </Accordion>

    </>);
}

export default ReportCacheJobsList