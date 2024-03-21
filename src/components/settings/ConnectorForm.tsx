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

import { Form, Formik }                  from "formik";
import { Button }                        from "primereact/button";
import { Column }                        from "primereact/column";
import { ConfirmDialog }                 from "primereact/confirmdialog";
import { DataTable }                     from "primereact/datatable";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputSwitch }                   from "primereact/inputswitch";
import { InputText }                     from "primereact/inputtext";
import { InputTextarea }                 from "primereact/inputtextarea";
import { Panel }                         from "primereact/panel";
import { Message }                       from "primereact/message";
import { SelectButton }                  from "primereact/selectbutton";
import { TabPanel, TabView }             from "primereact/tabview";
import * as React                        from "react";
import { useTranslation }                from "react-i18next";
import * as Yup                          from "yup";

import TConnector                                  from "../../types/TConnector";
import ButtonWithSpinner, { SubmitButtonStatus }   from "../common/form/ButtonWithSpinner";
import { apiSendRequest }                          from "../../services/api";
import { EAPIEndPoint }                            from "../../types/EAPIEndPoint";
import DropdownConnectorDatabase                   from "../common/form/DropdownConnectorDatabase";
import { context as authContext }                  from "../../contexts/auth/store/context";
import DropdownConnector                           from "../common/form/DropdownConnector";
import apiDataContext                              from "../../contexts/api_data/store/context";
import TReport                                     from "../../types/TReport";
import TParameterInput                             from "../../types/TParameterInput";
import { capitalizeFirstLetter, filterConnectors } from "../../utils/tools";
import env                                         from "../../envVariables";
import { Tooltip }                                 from "primereact/tooltip";
import { EConnectorPgsqlSslMode }                  from "../../types/EConnectorPgsqlSslMode";

enum EDeleteConnectorMethod {
    DELETE_EVERYTHING,
    ASSIGN_TO_ANOTHER_CONNECTOR
}

const ConnectorForm: React.FC<{
    connector: TConnector
    updateConnectorListCallback: CallableFunction,
    isNewConnector?: boolean,
}> = ({
          connector,
          updateConnectorListCallback,
          isNewConnector = false
      }): React.ReactElement => {

    const {state: authState} = React.useContext(authContext);
    const {state: apiDataState} = React.useContext(apiDataContext);

    const {t} = useTranslation(['common', 'settings']);

    const [submitButtonCreate, setSubmitButtonCreate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonValidateStatus, setSubmitButtonStatus] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonTestStatus, setSubmitButtonTestStatus] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonDelete, setSubmitButtonDelete] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [inputPasswordType, setInputPasswordType] = React.useState<string>('password');
    const [displayError, setDisplayError] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [numReports, setNumReports] = React.useState<number>(0);
    const [numParameterInputs, setNumParameterInputs] = React.useState<number>(0);
    const [connectorDeleteMethodExplanation, setConnectorDeleteMethodExplanation] = React.useState<string>('');
    const [connectorDeleteMethod, setConnectorDeleteMethod] = React.useState<number>(EDeleteConnectorMethod.ASSIGN_TO_ANOTHER_CONNECTOR);
    const [connectorDeleteNewConnectorId, setConnectorDeleteNewConnectorId] = React.useState<number>(0);
    const [connectorDeleteConfirmVisible, setConnectorDeleteConfirmVisible] = React.useState<boolean>(false);
    const connectorDeleteMethods = [
        {label: t('common:delete_all').toString(), value: EDeleteConnectorMethod.DELETE_EVERYTHING},
        {
            label: t('settings:global_administration.connector.assign_to_another_connector').toString(),
            value: EDeleteConnectorMethod.ASSIGN_TO_ANOTHER_CONNECTOR
        },
    ];

    const resetStates = (): void => {

        setDisplayError(false);
        setErrorMessage('');
    }

    const handleShowPassword = (): void => {

        if (inputPasswordType === 'password') {

            setInputPasswordType('text');
        } else {

            setInputPasswordType('password');
        }
    };

    const handleOnCreate = (values: TConnector): void => {

        resetStates();
        setSubmitButtonCreate(SubmitButtonStatus.Validating);

        values.organization_id = authState.user.organization_user.organization_id;
        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.CONF_CONNECTOR,
            resourceId: values.id,
            formValues: values,
            callbackSuccess: () => {
                setSubmitButtonCreate(SubmitButtonStatus.Validated);
                updateConnectorListCallback()
            },
            callbackError: (error) => {

                setSubmitButtonCreate(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    }

    const handleOnDelete = (values: TConnector): void => {

        resetStates();
        setSubmitButtonDelete(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'DELETE',
            endPoint: EAPIEndPoint.CONF_CONNECTOR,
            resourceId: values.id,
            urlParameters: connectorDeleteMethod === EDeleteConnectorMethod.ASSIGN_TO_ANOTHER_CONNECTOR
                ? [{key: 'new-connector-id', value: connectorDeleteNewConnectorId}]
                : [],
            callbackSuccess: () => {
                updateConnectorListCallback()
            },
            callbackError: (error) => {

                setSubmitButtonDelete(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    };

    const handleOnSubmit = (values: TConnector): void => {

        resetStates();
        setSubmitButtonStatus(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'PUT',
            endPoint: EAPIEndPoint.CONF_CONNECTOR,
            resourceId: values.id,
            formValues: values,
            callbackSuccess: () => {
                setSubmitButtonStatus(SubmitButtonStatus.Validated);
            },
            callbackError: (error) => {

                setSubmitButtonStatus(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    };

    const handleTest = (values: TConnector): void => {

        setDisplayError(false);
        setErrorMessage('');
        setSubmitButtonTestStatus(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.CONF_CONNECTOR,
            formValues: values,
            extraUrlPath: 'test-new-connector',
            callbackSuccess: () => {
                setSubmitButtonTestStatus(SubmitButtonStatus.Validated);
            },
            callbackError: (error) => {

                setSubmitButtonTestStatus(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.errors)
            }
        });
    };

    // Used to update delete method explanation depending on the one selected.
    //
    React.useEffect(() => {

        if (connectorDeleteMethod === EDeleteConnectorMethod.DELETE_EVERYTHING) {

            setConnectorDeleteMethodExplanation(t('settings:global_administration.connector.will_delete_everything').toString());
        } else {

            setConnectorDeleteMethodExplanation(t('settings:global_administration.connector.will_update_report_and_input_parameters').toString());
        }

    }, [connectorDeleteMethod, t]);

    // To select the first Connector available.
    // In delete User ConfirmDialog.
    //
    React.useEffect(() => {

        if (apiDataState.connectors.length > 0 && !apiDataState.connectorsLoading) {

            const filteredConnectors: Array<TConnector> = filterConnectors(apiDataState.connectors, [connector.id])
                .filter((connector: TConnector) => !connector.global);

            if (filteredConnectors.length > 0) {

                setConnectorDeleteNewConnectorId(filteredConnectors[0].id);
            }
        }

    }, [apiDataState.connectors, apiDataState.connectorsLoading, apiDataState.users, apiDataState.usersLoading, connector]);

    // Used to count the number of report and report parameters made with this connector.
    //
    React.useEffect(() => {

        setNumReports(apiDataState.reports.filter((report: TReport) => report.conf_connector_id === connector.id).length);
        setNumParameterInputs(apiDataState.parameterInputs.filter((parameterInput: TParameterInput) => parameterInput.conf_connector_id === connector.id).length);
    }, [apiDataState.parameterInputs, apiDataState.reports, connector.id]);

    return (
        <>
            <ConfirmDialog
                accept={() => {

                    handleOnDelete(connector);
                    setConnectorDeleteConfirmVisible(false);
                }}
                acceptLabel={connectorDeleteMethod === EDeleteConnectorMethod.DELETE_EVERYTHING
                    ? t('common:form.delete').toString()
                    : capitalizeFirstLetter(t('settings:global_administration.connector.assign_to_another_connector').toString())
                    + ' ' + t('common:and').toString() + ' ' + t('common:form.delete').toString().toLowerCase()
                }
                acceptIcon={'pi pi-check'}
                acceptClassName={connectorDeleteMethod === EDeleteConnectorMethod.DELETE_EVERYTHING ? 'p-button-danger' : 'p-button-secondary'}
                contentStyle={{height: '550px'}}
                contentClassName="flex flex-row align-items-start justify-content-start"
                header={`${numReports > 0 && t('settings:global_administration.connector.delete_connector_alert', {count: numReports}).toString()}
                ${numReports > 0 && t('common:and').toString() + ' '}
                ${numParameterInputs > 0 && t('settings:global_administration.connector.delete_input_parameter_alert', {count: numParameterInputs}).toString()}`}
                maximizable
                message={
                    <TabView className=" ">
                        <TabPanel header={t('settings:global_administration.connector.action_to_perform').toString()}>

                            <div className="formgrid grid">
                                <div className="field col-12">
                                    <SelectButton
                                        value={connectorDeleteMethod}
                                        options={connectorDeleteMethods}
                                        onChange={(event) => {
                                            setConnectorDeleteMethod(event.value);
                                        }}
                                    />
                                </div>
                                <div className="field col-12">
                                    <Message
                                        style={{width: '100%'}}
                                        severity={connectorDeleteMethod === EDeleteConnectorMethod.ASSIGN_TO_ANOTHER_CONNECTOR ? 'info' : 'warn'}
                                        text={connectorDeleteMethodExplanation}
                                    />
                                </div>
                                <div className="field col-12">
                                    <DropdownConnector
                                        disabled={connectorDeleteMethod !== EDeleteConnectorMethod.ASSIGN_TO_ANOTHER_CONNECTOR}
                                        defaultValue={connectorDeleteNewConnectorId}
                                        id="user_delete_new_dev_id"
                                        isInvalid={false}
                                        selectFirst
                                        excludeConnectorIds={[connector.id]}
                                        includeGlobalConnector={false}
                                        onChange={(event: DropdownChangeEvent) => {

                                            setConnectorDeleteNewConnectorId(event.value)
                                        }}
                                    />
                                </div>
                            </div>

                        </TabPanel>

                        <TabPanel header={t('settings:global_administration.connector.affected_reports').toString()}>
                            <DataTable
                                value={apiDataState.reports.filter((report: TReport) => report.conf_connector_id === connector.id)}
                                size="small" scrollable scrollHeight="430px">
                                <Column field="name" header={t('common:form.name').toString()}></Column>
                                <Column field="description_listing"
                                        header={t('common:form.description').toString()}>
                                </Column>
                            </DataTable>
                        </TabPanel>

                        <TabPanel header={t('settings:global_administration.connector.affected_parameter_inputs')}>
                            <DataTable
                                value={apiDataState.parameterInputs.filter((parameterInput: TParameterInput) => parameterInput.conf_connector_id === connector.id)}
                                size="small" scrollable
                                scrollHeight="430px">
                                <Column field="name" header={t('common:form.name').toString()}></Column>
                                <Column field="parameter_input_type.name"
                                        header={t('common:form.type').toString()}>
                                </Column>
                            </DataTable>
                        </TabPanel>
                    </TabView>
                }
                onHide={() => setConnectorDeleteConfirmVisible(false)}
                reject={() => {

                    setConnectorDeleteConfirmVisible(false);
                }}
                rejectClassName="p-button-info"
                rejectIcon="pi pi-times"
                rejectLabel={t('common:form.cancel').toString()}
                visible={connectorDeleteConfirmVisible}

            />
            <Formik
                validateOnMount={true}
                validationSchema={Yup.object({
                    name: Yup.string().required(),
                    connector_database_id: Yup.string().min(1).required(),
                    host: Yup.string().required(),
                    database: Yup.string().required(),
                    username: Yup.string().required(),
                    password: Yup.string().required(),
                    port: Yup.number().min(1).required(),
                })}
                onSubmit={values => handleOnSubmit(values)}
                initialValues={{
                    ...connector,
                    ssl_ca: connector.ssl_ca ?? '',
                    ssl_key: connector.ssl_key ?? '',
                    ssl_cert: connector.ssl_cert ?? '',
                    ssl_cipher: connector.ssl_cipher ?? '',
                    mysql_ssl_verify_server_cert: connector.mysql_ssl_verify_server_cert ?? false,
                    pgsql_ssl_mode: connector.pgsql_ssl_mode ?? EConnectorPgsqlSslMode.DISABLE,
                }}
            >
                {(formik
                ) => (
                    <Form placeholder="" onSubmit={formik.handleSubmit}>

                        <Tooltip target=".database-name-tooltip"
                                 position="bottom"
                                 content={t('settings:global_administration.connector.database_name_tooltip').toString()}
                                 showDelay={env.tooltipShowDelay}
                                 hideDelay={env.tooltipHideDelay}
                        />

                        <div className="formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="connector_database_id">{t('settings:global_administration.connector.connector')}</label>
                                <DropdownConnectorDatabase
                                    id="connector_database_id"
                                    placeholder={t('settings:global_administration.connector.connector').toString()}
                                    className={!!formik.errors.connector_database_id ? 'p-invalid w-full' : 'w-full'}
                                    optionValue="id"
                                    optionLabel="name"
                                    value={formik.values.connector_database_id}
                                    onChange={(event) => {
                                        formik.handleChange({
                                            target: {value: event.value, name: 'connector_database_id'}
                                        });

                                        switch (event.value) {
                                            case 1: // MySQL | MariaDB
                                                formik.setFieldValue('port', 3306);
                                                break;
                                            case 2: // Postgres
                                                formik.setFieldValue('port', 5432);
                                                break;
                                            default:
                                                formik.setFieldValue('port', 3306);
                                        }


                                    }}
                                    isInvalid={!!formik.errors.connector_database_id}
                                />
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor="name">{t('common:form.name')}</label>
                                <InputText
                                    id="name"
                                    type="text"
                                    {...formik.getFieldProps('name')}
                                    className={!!formik.errors.name ? 'p-invalid w-full' : 'w-full'}
                                    placeholder={t('common:form.name').toString()}
                                    autoFocus
                                />
                            </div>

                            <div className="field col-12 mb-0">
                                <label htmlFor="username">
                                    {t('settings:global_administration.connector.database_connection').toString()}
                                </label>
                                <div className="p-inputgroup">
                                <span className="p-inputgroup-addon w-2">
                                    <label htmlFor="host">{t('settings:global_administration.connector.host')}</label>
                                </span>
                                    <InputText
                                        id="host"
                                        type="text"
                                        {...formik.getFieldProps('host')}
                                        className={!!formik.errors.host ? 'p-invalid w-full' : 'w-full'}
                                        placeholder={t('settings:global_administration.connector.host').toString()}
                                    />
                                    <span className="p-inputgroup-addon w-2">
                                    <label htmlFor="port">Port</label>
                                </span>
                                    <InputText
                                        id="port"
                                        type="text"
                                        {...formik.getFieldProps('port')}
                                        className={!!formik.errors.port ? 'p-invalid w-full' : 'w-full'}
                                        placeholder="Port"
                                        keyfilter="int"
                                    />
                                    <span className="p-inputgroup-addon w-10">
                                    <label htmlFor="database">
                                        {t('settings:global_administration.connector.database_name').toString()}
                                    </label>
                                        &nbsp;&nbsp;&nbsp;
                                        <i className="pi pi-question-circle database-name-tooltip"/>
                                </span>
                                    <InputText
                                        id="database"
                                        type="text"
                                        {...formik.getFieldProps('database')}
                                        className={!!formik.errors.database ? 'p-invalid w-full' : 'w-full'}
                                        placeholder={t('settings:global_administration.connector.database_name').toString()}
                                    />
                                </div>
                            </div>

                            <div className="field col-12 p-mt-1">
                                <div className="p-inputgroup">
                                <span className="p-inputgroup-addon w-3">
                                    <label htmlFor="username">{t('common:form.username')}</label>
                                </span>
                                    <InputText
                                        id="username"
                                        type="text"
                                        {...formik.getFieldProps('username')}
                                        className={!!formik.errors.username ? 'p-invalid w-full' : 'w-full'}
                                        placeholder={t('common:form.username').toString()}
                                    />
                                    <span className="p-inputgroup-addon w-3">
                                    <label htmlFor="password">{t('common:form.password')}</label>
                                </span>
                                    <InputText
                                        id="password"
                                        type={inputPasswordType}
                                        {...formik.getFieldProps('password')}
                                        className={!!formik.errors.password ? 'p-invalid w-full' : 'w-full'}
                                        placeholder={t('common:form.password').toString()}
                                    />
                                    <Button
                                        icon={`pi ${inputPasswordType === 'password' ? 'pi-eye-slash' : 'pi-eye'}`}
                                        className="p-button-help w-1"
                                        onClick={() => handleShowPassword()}
                                        type="button"
                                    />
                                </div>
                            </div>

                            <div className="field col-12">
                                <Panel header={t('settings:global_administration.connector.grants').toString()}
                                       toggleable
                                       className=""
                                >
                                    <div dangerouslySetInnerHTML={{__html: String(connector.raw_grants)}}/>
                                </Panel>
                            </div>

                            <div className="field col-12">
                                <Panel header={t('settings:global_administration.connector.encryption').toString()}
                                       toggleable
                                       className=""
                                       icons={
                                           <i
                                               className={`pi ${formik.values?.ssl_cipher && formik.values.ssl_cipher.length > 3 ? 'pi-lock' : 'pi-lock-open'} ml-5 mr-2`}
                                           />}
                                       collapsed
                                >
                                    <div className="grid">

                                        <div className="field p-inputgroup">
                                            <span className="p-inputgroup-addon w-2">
                                                <label htmlFor="use_ssl">{t('settings:global_administration.connector.use_ssl')}</label>
                                            </span>
                                            <span className="p-inputgroup-addon w-1" style={{background: 'inherit'}}>
                                                <InputSwitch
                                                    id="use_ssl"
                                                    checked={formik.values.use_ssl}
                                                    {...formik.getFieldProps('use_ssl')}
                                                />
                                            </span>

                                            {/*MySQL / MariaDB*/}
                                            <span style={{display: `${formik.getFieldProps('connector_database_id').value === 1 ? '' : 'none'}`}} className="p-inputgroup-addon w-2">
                                                <label htmlFor="mysql_ssl_verify_server_cert">{t('settings:global_administration.connector.mysql_ssl_verify_server_cert')}</label>
                                            </span>
                                            <span style={{background: 'inherit', display: `${formik.getFieldProps('connector_database_id').value === 1 ? '' : 'none'}`}} className="p-inputgroup-addon w-1">
                                                <InputSwitch
                                                    id="mysql_ssl_verify_server_cert"
                                                    checked={formik.values.mysql_ssl_verify_server_cert}
                                                    {...formik.getFieldProps('mysql_ssl_verify_server_cert')}
                                                    disabled={!formik.values.use_ssl}
                                                />
                                            </span>

                                            {/*PostgreSQL*/}
                                            <span style={{display: `${formik.getFieldProps('connector_database_id').value === 2 ? '' : 'none'}`}} className="p-inputgroup-addon w-2">
                                                <label htmlFor="pgsql_ssl_mode">{t('settings:global_administration.connector.pgsql_ssl_mode')}</label>
                                            </span>
                                            <span style={{display: `${formik.getFieldProps('connector_database_id').value === 2 ? '' : 'none'}`}} className="p-inputgroup-addon w-2">
                                                <Dropdown id="pgsql_ssl_mode"
                                                          {...formik.getFieldProps('pgsql_ssl_mode')}
                                                          onChange={(event) => {
                                                              formik.handleChange({
                                                                  target: {value: event.value, name: 'pgsql_ssl_mode'}
                                                              });
                                                          }}
                                                          options={[
                                                              {
                                                                  label: 'disable',
                                                                  value: EConnectorPgsqlSslMode.DISABLE
                                                              }, {
                                                                  label: 'disable',
                                                                  value: EConnectorPgsqlSslMode.ALLOW
                                                              },
                                                              {
                                                                  label: 'allow',
                                                                  value: EConnectorPgsqlSslMode.PREFER
                                                              },
                                                              {
                                                                  label: 'prefer',
                                                                  value: EConnectorPgsqlSslMode.REQUIRE
                                                              },
                                                              {
                                                                  label: 'verify-ca',
                                                                  value: EConnectorPgsqlSslMode.VERIFY_CA
                                                              },
                                                              {
                                                                  label: 'verify-full',
                                                                  value: EConnectorPgsqlSslMode.VERIFY_FULL
                                                              }]}
                                                          optionValue="value"
                                                          placeholder="Select..."
                                                          className="w-full md:w-14rem"
                                                          disabled={!formik.values.use_ssl}

                                                />
                                            </span>

                                            <span className="p-inputgroup-addon w-2">
                                                <label htmlFor="ssl_cipher">{t('settings:global_administration.connector.cipher_in_use')}</label>
                                            </span>
                                            <InputText id="ssl_cipher"
                                                       {...formik.getFieldProps('ssl_cipher')}
                                                       placeholder={t('settings:global_administration.connector.ssl_cypher').toString()}
                                                       disabled={true}
                                            />
                                        </div>

                                        <div className="field col-12 md:col-4">
                                            <label htmlFor="ssl_ca">{t('settings:global_administration.connector.ssl_ca')}</label>
                                            <InputTextarea
                                                id="ssl_ca"
                                                {...formik.getFieldProps('ssl_ca')}
                                                className={!!formik.errors.ssl_ca ? 'p-invalid w-full' : 'w-full'}
                                                // @ts-ignore
                                                rows={20}
                                                disabled={!formik.values.use_ssl}
                                                placeholder="-----BEGIN CERTIFICATE-----&#13;&#10;
                                            ...&#13;&#10;
                                            -----END CERTIFICATE-----"
                                            />
                                        </div>

                                        <div className="field col-12 md:col-4">
                                            <label htmlFor="ssl_key">{t('settings:global_administration.connector.ssl_key')}</label>
                                            <InputTextarea
                                                id="ssl_key"
                                                {...formik.getFieldProps('ssl_key')}
                                                className={!!formik.errors.ssl_key ? 'p-invalid w-full' : 'w-full'}
                                                // @ts-ignore
                                                rows={20}
                                                disabled={!formik.values.use_ssl}
                                                placeholder="-----BEGIN RSA PRIVATE KEY-----&#13;&#10;
                                            ...&#13;&#10;
                                            -----END RSA PRIVATE KEY-----"
                                            />
                                        </div>

                                        <div className="field col-12 md:col-4">
                                            <label htmlFor="ssl_cert">{t('settings:global_administration.connector.ssl_cert')}</label>
                                            <InputTextarea
                                                id="ssl_cert"
                                                {...formik.getFieldProps('ssl_cert')}
                                                className={!!formik.errors.ssl_cert ? 'p-invalid w-full' : 'w-full'}
                                                // @ts-ignore
                                                rows={20}
                                                disabled={!formik.values.use_ssl}
                                                placeholder="-----BEGIN CERTIFICATE-----&#13;&#10;
                                            ...&#13;&#10;
                                            -----END CERTIFICATE-----"
                                            />
                                        </div>
                                    </div>
                                </Panel>
                            </div>

                            <div className="field col-12">
                                <div className="flex justify-content-end">
                                    <div className="mr-2">
                                        <ButtonWithSpinner
                                            buttonStatus={submitButtonTestStatus}
                                            disabled={!formik.isValid}
                                            labels={{
                                                default: t('settings:global_administration.connector.test').toString(),
                                                validating: t('settings:global_administration.connector.testing').toString(),
                                                validated: t('settings:global_administration.connector.test_successful').toString(),
                                                notValidated: t('settings:global_administration.connector.test_failed').toString(),
                                            }}
                                            onClick={() => handleTest(formik.values)}
                                            type="button"
                                            severity="info"
                                        />
                                    </div>
                                    {!isNewConnector ?
                                        <>
                                            <div className="mr-2">
                                                <ButtonWithSpinner
                                                    type="button"
                                                    buttonStatus={submitButtonDelete}
                                                    disabled={!formik.isValid}
                                                    labels={{
                                                        default: t('common:form.delete').toString(),
                                                        validating: t('common:form.deleting').toString(),
                                                        validated: t('common:form.deleted').toString(),
                                                        notValidated: t('common:form.delete_failed').toString(),
                                                    }}
                                                    severity="danger"
                                                    validateAction
                                                    validateActionCallback={() => handleOnDelete(formik.values)}
                                                    onClick={(event) => {
                                                        event.preventDefault();

                                                        if (numReports > 0 || numParameterInputs > 0) {

                                                            setConnectorDeleteConfirmVisible(true);
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <ButtonWithSpinner
                                                    buttonStatus={submitButtonValidateStatus}
                                                    disabled={!formik.isValid}
                                                    type="submit"
                                                />
                                            </div>
                                        </>
                                        :
                                        <div>
                                            <ButtonWithSpinner
                                                type="button"
                                                buttonStatus={submitButtonCreate}
                                                disabled={!formik.isValid}
                                                labels={{
                                                    default: t('common:form.create').toString(),
                                                    validating: t('common:form.creating').toString(),
                                                    validated: t('common:form.created').toString(),
                                                    notValidated: t('common:form.create_failed').toString(),
                                                }}
                                                className="mr-3"
                                                onClick={() => handleOnCreate(formik.values)}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>

                            {displayError &&
                                <div className="col-12">
                                    <Message severity="error" text={errorMessage}/>
                                </div>
                            }

                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
};

export default ConnectorForm;