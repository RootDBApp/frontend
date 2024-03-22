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

import { Calendar }            from "primereact/calendar";
import { DataTable }           from "primereact/datatable";
import { InputNumber }         from "primereact/inputnumber";
import { InputSwitch }         from "primereact/inputswitch";
import { TabPanel, TabView }   from "primereact/tabview";
import { Message }             from "primereact/message";
import { Formik, FormikProps } from "formik";
import * as React              from "react";
import { useTranslation }      from "react-i18next";
import * as Yup                from "yup";

import { TCacheJob }                             from "../../types/TCacheJob";
import DropdownCacheJobFrequency                 from "../common/form/DropdownCacheJobFrequency";
import DropdownWeekDay                           from "../common/form/DropdownWeekDay";
import { ECacheJobFrequency }                    from "../../types/ECacheJobFrequency";
import { EWeekDay }                              from "../../types/EWeekDay";
import ButtonWithSpinner, { SubmitButtonStatus } from "../common/form/ButtonWithSpinner";
import ReportCacheJobParameters                  from "./ReportCacheJobParameters";
import TReport                                   from "../../types/TReport";
import { TNameValue }                            from "../../types/TNameValue";
import TReportParameter                          from "../../types/TReportParameter";
import { apiSendRequest }                        from "../../services/api";
import { EAPIEndPoint }                          from "../../types/EAPIEndPoint";
import { Column }                                from "primereact/column";
import { convertDateToLocalTimeZone }            from "../../utils/tools";

const ReportCacheJobForm: React.FC<{
    cacheJob: TCacheJob,
    onUpdate: CallableFunction,
    report: TReport | null,
    isNewCacheJob?: boolean,
}> = ({
          cacheJob,
          onUpdate,
          report,
          isNewCacheJob,
      }): React.ReactElement => {


    const {t} = useTranslation(['common', 'report']);

    const [submitButtonCreate, setSubmitButtonCreate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonUpdate, setSubmitButtonUpdate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonDelete, setSubmitButtonDelete] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonDeleteCache, setSubmitButtonDeleteCache] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonRun, setSubmitButtonRun] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [displayError, setDisplayError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const resetStates = (): void => {

        setDisplayError(false);
        setErrorMessage('');
    }

    const handleOnCreate = (cacheJob: TCacheJob): void => {

        resetStates();
        setSubmitButtonCreate(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.CACHE_JOB,
            formValues: {...cacheJob, at_time: convertDateToLocalTimeZone(cacheJob.at_time)},
            callbackSuccess: () => {
                setSubmitButtonCreate(SubmitButtonStatus.Validated);
                onUpdate();
            },
            callbackError: (error) => {

                setSubmitButtonCreate(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    }

    const handleOnUpdate = (cacheJob: TCacheJob): void => {

        setSubmitButtonUpdate(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'PUT',
            endPoint: EAPIEndPoint.CACHE_JOB,
            formValues: {...cacheJob, at_time: convertDateToLocalTimeZone(cacheJob.at_time)},
            resourceId: cacheJob.id,
            callbackSuccess: () => {
                setSubmitButtonUpdate(SubmitButtonStatus.Validated);
                onUpdate();
            },
            callbackError: (error) => {

                setSubmitButtonUpdate(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    }

    const handleOnDelete = (cacheJob: TCacheJob): void => {

        resetStates();
        setSubmitButtonDelete(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'DELETE',
            endPoint: EAPIEndPoint.CACHE_JOB,
            resourceId: cacheJob.id,
            callbackSuccess: () => {
                onUpdate();
            },
            callbackError: (error) => {

                setSubmitButtonDelete(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    }

    const handleOnDeleteCache = (cacheJob: TCacheJob): void => {

        resetStates();
        setSubmitButtonDeleteCache(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.CACHE_JOB,
            resourceId: cacheJob.id,
            extraUrlPath: 'delete-cache-report',
            callbackSuccess: () => {
                setSubmitButtonDeleteCache(SubmitButtonStatus.ToValidate);
            },
            callbackError: (error) => {

                setSubmitButtonDeleteCache(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    }

    const handleOnRunCacheJob = (cacheJob: TCacheJob): void => {

        resetStates();
        setSubmitButtonRun(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.CACHE_JOB,
            resourceId: cacheJob.id,
            extraUrlPath: 'run',
            callbackSuccess: () => {
                setSubmitButtonRun(SubmitButtonStatus.Validated);
            },
            callbackError: (error) => {

                setSubmitButtonRun(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    }

    const setupTTLByFrequency = (formikProps: FormikProps<any>, frequencyType: ECacheJobFrequency): void => {

        switch (frequencyType) {

            case ECacheJobFrequency.EVERY_THIRTY_MINUTES:
                formikProps.setFieldValue('ttl', 1800);
                break;

            case ECacheJobFrequency.HOURLY_AT:
                formikProps.setFieldValue('ttl', 3600);
                break;

            case ECacheJobFrequency.DAILY_AT:
                formikProps.setFieldValue('ttl', 86400);
                break;

            case ECacheJobFrequency.WEEKLY_ON:
                formikProps.setFieldValue('ttl', 604800);
                break;

            case ECacheJobFrequency.MONTHLY_ON:
                formikProps.setFieldValue('ttl', 18748800);
                break;

            default:
                formikProps.setFieldValue('ttl', 900);
                break;
        }
    }

    const updateCacheJobParameterSetConfigValue = (cacheJobParameterSetConfig: TCacheJobParameterSetConfig, inputNameValue: TNameValue, parameter: TReportParameter): TCacheJobParameterSetConfig => {

        switch (parameter.parameter_input?.parameter_input_type?.name) {

            case 'date':
                return {...cacheJobParameterSetConfig, date_start_from_values: {'values': String(inputNameValue.value).split(',')}};

            case 'multi-select':
                return {...cacheJobParameterSetConfig, multi_select_values: {'values': String(inputNameValue.value).split(',')}};

            case 'select':
                return {...cacheJobParameterSetConfig, select_values: {'values': String(inputNameValue.value).split(',')}};

            default:
                return {...cacheJobParameterSetConfig, value: String(inputNameValue.value)};
        }

    }

    React.useEffect(() => {

        setSubmitButtonRun(cacheJob.running ? SubmitButtonStatus.Validating : SubmitButtonStatus.ToValidate);
    }, [cacheJob.running]);

    return (
        <Formik
            key={cacheJob.id}
            validateOnMount={true}
            validationSchema={Yup.object({})}
            onSubmit={(formikValues): void => {
                if (cacheJob.id === 0) {

                    handleOnCreate(formikValues);

                } else {

                    handleOnUpdate(formikValues)
                }
            }}
            initialValues={{
                id: cacheJob.id,
                report_id: cacheJob.report_id,
                frequency: cacheJob.frequency,
                at_minute: cacheJob.at_minute === null ? 1 : cacheJob.at_minute,
                at_time: cacheJob.at_time === null ? new Date() : cacheJob.at_time,
                at_weekday: cacheJob.at_weekday === null ? EWeekDay.MONDAY : cacheJob.at_weekday,
                at_day: cacheJob.at_day === null ? new Date().getUTCDate() : cacheJob.at_day,
                ttl: cacheJob.ttl === null ? 900 : cacheJob.ttl,
                last_run: cacheJob.last_run,
                last_run_duration: cacheJob.last_run_duration,
                last_num_parameter_sets: cacheJob.last_num_parameter_sets,
                last_cache_size: cacheJob.last_cache_size,
                activated: cacheJob.activated,
                running: cacheJob.running,
                cache_job_parameter_set_configs: cacheJob.cache_job_parameter_set_configs
            }}
        >
            {(formik) => (
                <form onSubmit={formik.handleSubmit}>
                    <div className="formgrid grid">

                        <div className="field col-12 md:col-2">
                            <label htmlFor="activated">{t('common:form.activated')} ?</label><br/>
                            <InputSwitch
                                id="activated"
                                checked={formik.values.activated}
                                {...formik.getFieldProps('activated')}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="frequency">{t('report:form.cache_job.frequency')}</label><br/>
                            <DropdownCacheJobFrequency
                                onChange={(event) => {
                                    formik.handleChange({
                                        target: {value: event.value, name: 'frequency'}
                                    });

                                    setupTTLByFrequency(formik, event.value);
                                }}
                                id="frequency"
                                isInvalid={!!formik.errors.frequency}
                                value={formik.values.frequency}
                            />
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="ttl">TTL</label><br/>
                            <InputNumber
                                id="ttl"
                                {...formik.getFieldProps('ttl')}
                                /* Without that, we have : target is undefined */
                                onChange={() => {
                                }}
                                mode="decimal"
                                showButtons
                                min={0}
                                max={32140800} /* one year, in seconds*/
                                step={10}
                            />
                        </div>


                        <div className="field col-12 md:col-4">
                            <label htmlFor="activated">{t('report:form.cache_job.at_minute')}</label><br/>
                            <InputNumber
                                id="at_minute"
                                {...formik.getFieldProps('at_minute')}
                                /* Without that, we have : target is undefined */
                                onChange={() => {
                                }}
                                mode="decimal"
                                showButtons
                                min={0}
                                max={59} /* one year, in seconds*/
                                disabled={formik.getFieldProps('frequency').value !== ECacheJobFrequency.HOURLY_AT}
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="activated">{t('report:form.cache_job.at_time')}</label><br/>
                            {/*@ts-ignore*/}
                            <Calendar
                                id="at_time"
                                {...formik.getFieldProps('at_time')}
                                timeOnly
                                disabled={formik.getFieldProps('frequency').value !== ECacheJobFrequency.DAILY_AT
                                    && formik.getFieldProps('frequency').value !== ECacheJobFrequency.WEEKLY_ON
                                    && formik.getFieldProps('frequency').value !== ECacheJobFrequency.MONTHLY_ON
                                }
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="at_weekday">{t('report:form.cache_job.at_weekday')}</label><br/>
                            <DropdownWeekDay
                                onChange={(event) => {
                                    formik.handleChange({
                                        target: {value: event.value, name: 'at_weekday'}
                                    });
                                }}
                                id="at_weekday"
                                isInvalid={!!formik.errors.at_weekday}
                                value={formik.values.at_weekday.toString()}
                                disabled={formik.getFieldProps('frequency').value !== ECacheJobFrequency.WEEKLY_ON}
                            />
                        </div>


                        <div className="field col-12">
                            <label htmlFor="activated">{t('report:form.cache_job.at_day')}</label><br/>
                            <InputNumber
                                id="at_day"
                                {...formik.getFieldProps('at_day')}
                                /* Without that, we have : target is undefined */
                                onChange={() => {
                                }}
                                mode="decimal"
                                showButtons
                                min={1}
                                max={31}
                                disabled={formik.getFieldProps('frequency').value !== ECacheJobFrequency.MONTHLY_ON}
                            />
                        </div>

                    </div>


                    {(cacheJob.last_run || (!cacheJob.last_run && report?.parameters && report?.parameters?.length > 0))
                        && <TabView activeIndex={(isNewCacheJob ? 0 : (cacheJob.last_run ? 1 : 0))}>

                            {(report?.parameters && report?.parameters?.length > 0) &&
                                <TabPanel header={t('report:form.cache_job.parameters_set').toString()}>
                                    <ReportCacheJobParameters
                                        cacheJobParameterSetConfigs={formik.values.cache_job_parameter_set_configs}
                                        report={report}
                                        onChange={(inputNameValue: TNameValue, parameter: TReportParameter): void => {

                                            formik.setFieldValue(
                                                'cache_job_parameter_set_configs',
                                                formik.values.cache_job_parameter_set_configs.map(
                                                    (cacheJobParameterSetConfig: TCacheJobParameterSetConfig) => {

                                                        if (cacheJobParameterSetConfig.report_parameter_id === parameter.id) {

                                                            return updateCacheJobParameterSetConfigValue(cacheJobParameterSetConfig, inputNameValue, parameter);
                                                        }

                                                        return cacheJobParameterSetConfig;
                                                    })
                                            );
                                        }}
                                    />
                                </TabPanel>
                            }

                            {!isNewCacheJob &&
                                <TabPanel header={t('report:form.cache_job.cache_statistics')}>
                                    <DataTable
                                        showHeaders={false}
                                        size="small"
                                        value={[
                                            {
                                                'key': t('report:form.cache_job.last_run').toString(),
                                                'value': String(
                                                    cacheJob.last_run
                                                        ? (cacheJob.last_run.toDateString() + ' ' + t('common:at').toString() + ' ' + cacheJob.last_run.getHours().toString() + ':' + cacheJob.last_run.getMinutes().toString())
                                                        : '/'
                                                )
                                            },
                                            {
                                                'key': t('report:form.cache_job.last_run_duration').toString(),
                                                'value': String(
                                                    cacheJob.last_run_duration
                                                        ? cacheJob.last_run_duration + ' s | ' + Math.round(cacheJob.last_run_duration / 60).toString() + ' m'
                                                        : '/'
                                                )
                                            },
                                            {'key': t('report:form.cache_job.last_num_parameter_sets').toString(), 'value': String(cacheJob.last_num_parameter_sets ?? '/')},
                                            {'key': t('report:form.cache_job.last_cache_size').toString(), 'value': String(cacheJob.last_cache_size ?? '/')},
                                        ]}
                                        tableStyle={{minWidth: '100%'}}
                                    >
                                        <Column field="key"></Column>
                                        <Column field="value"></Column>
                                    </DataTable>
                                </TabPanel>
                            }

                        </TabView>
                    }


                    <div className="flex justify-content-between">
                        <div className="flex justify-content-start">
                            {!isNewCacheJob &&
                                <>
                                    <ButtonWithSpinner
                                        type="button"
                                        buttonStatus={submitButtonRun}
                                        disabled={!formik.isValid || !cacheJob.activated}
                                        labels={{
                                            default: t('report:cache.start_cache_job').toString(),
                                            validating: t('report:cache.caching_in_progress').toString(),
                                            validated: t('report:cache.cache_job_started').toString(),
                                            notValidated: t('report:cache.unable_to_start_cache_job').toString(),
                                        }}
                                        severity="success"
                                        onClick={() => handleOnRunCacheJob(formik.values)}
                                        className="mr-2"
                                        doNotAutomaticallyReinitializeLabel
                                    />
                                    {cacheJob.last_run &&
                                        <ButtonWithSpinner
                                            type="button"
                                            buttonStatus={submitButtonDeleteCache}
                                            disabled={!formik.isValid || cacheJob.running}
                                            labels={{
                                                default: t('report:cache.delete_cache_job_cache').toString(),
                                                validating: t('common:form.deleting').toString(),
                                                validated: t('common:form.deleted').toString(),
                                                notValidated: t('common:form.delete_failed').toString(),
                                            }}
                                            severity="danger"
                                            validateAction
                                            validateActionCallback={() => handleOnDeleteCache(formik.values)}
                                        />
                                    }
                                </>
                            }
                        </div>
                        <div className="flex justify-content-end">
                            {!isNewCacheJob ?
                                <>
                                    <div className="mr-2">
                                        <ButtonWithSpinner
                                            type="button"
                                            buttonStatus={submitButtonDelete}
                                            disabled={!formik.isValid || cacheJob.running}
                                            labels={{
                                                default: t('common:form.delete').toString(),
                                                validating: t('common:form.deleting').toString(),
                                                validated: t('common:form.deleted').toString(),
                                                notValidated: t('common:form.delete_failed').toString(),
                                            }}
                                            severity="danger"
                                            validateAction
                                            validateActionCallback={() => handleOnDelete(formik.values)}
                                        />
                                    </div>

                                    <div className="mr-2">
                                        <ButtonWithSpinner
                                            buttonStatus={submitButtonUpdate}
                                            disabled={!formik.isValid}
                                            labels={{
                                                default: t('common:form.update').toString(),
                                                validating: t('common:form.updating').toString(),
                                                validated: t('common:form.updated').toString(),
                                                notValidated: t('common:form.update_failed').toString(),
                                            }}
                                            type="submit"
                                        />
                                    </div>
                                </>
                                :
                                <div>
                                    <ButtonWithSpinner
                                        buttonStatus={submitButtonCreate}
                                        disabled={!formik.isValid}
                                        labels={{
                                            default: t('common:form.create').toString(),
                                            validating: t('common:form.creating').toString(),
                                            validated: t('common:form.created').toString(),
                                            notValidated: t('common:form.create_failed').toString(),
                                        }}
                                        className="mr-3"
                                        type="submit"
                                    />
                                </div>
                            }
                        </div>
                    </div>

                    {
                        displayError && <div className="col-12">
                            <Message severity="error" text={errorMessage}/>
                        </div>
                    }

                </form>
            )
            }
        </Formik>
    )
        ;
}

export default ReportCacheJobForm;