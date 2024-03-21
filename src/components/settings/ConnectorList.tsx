import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText }               from "primereact/inputtext";
import * as React                  from 'react';
import { useTranslation }          from "react-i18next";

import ConnectorForm       from './ConnectorForm';
import TConnector          from "../../types/TConnector";
import TLaravelPagination  from "../../types/TLaravelPagination";
import { apiSendRequest }  from "../../services/api";
import { EAPIEndPoint }    from "../../types/EAPIEndPoint";
import LaravelPaginator    from "../common/LaravelPaginator";
import MiniProgressSpinner from "../common/loading/MiniProgressSpinner";
import HelpButton          from "../help/HelpButton";

const ConnectorList = (): React.ReactElement => {

    const {t} = useTranslation(['common', 'settings']);

    const [connectors, setConnectors] = React.useState<Array<TConnector>>([]);
    const [pagination, setPagination] = React.useState<TLaravelPagination | undefined>();
    const [apiServerIp, setApiServerIp] = React.useState<React.ReactElement>(<MiniProgressSpinner/>);
    const [checkStarted, setCheckStarted] = React.useState<boolean>(false);

    const getConfConnectors = (pageNum: number = 1): void => {

        apiSendRequest({
            method: 'GET',
            endPoint: EAPIEndPoint.CONF_CONNECTOR,
            urlParameters: [
                {key: 'page', value: pageNum},
                {key: 'for-admin', value: 1}
            ],
            callbackSuccess: (response: Array<TConnector>, pagination?: TLaravelPagination) => {

                setConnectors(response.map((connector: TConnector) => {
                    connector.check_in_progress = true;
                    return connector
                }));
                if (pagination) {

                    setPagination(pagination);
                }
            }
        });
    };

    const getApiServerIp = (): void => {

        apiSendRequest({
            method: 'GET',
            endPoint: EAPIEndPoint.CONF_CONNECTOR,
            extraUrlPath: 'get-api-server-ip',
            callbackSuccess: (response: { ip: string }) => {
                setApiServerIp(<InputText value={response.ip}/>)
            }
        });
    };

    const paginationUpdate = (page: number): void => {
        getConfConnectors(page);
    };

    // Check asynchronously all connectors
    //
    React.useEffect(() => {

        if (connectors.length > 0 && !checkStarted) {

            setCheckStarted(true);
            for (const [, connector] of connectors.entries()) {

                // Global connectors does not contains valid DB connexion.
                if (connector.global) {
                    continue;
                }

                apiSendRequest({
                    method: 'POST',
                    endPoint: EAPIEndPoint.CONF_CONNECTOR,
                    resourceId: connector.id,
                    extraUrlPath: 'test-existing-connector',
                    formValues: connector,
                    callbackSuccess: (connectorTested: TConnector) => {

                        let connectorsUpdated = connectors.map((connectorLooped: TConnector) => {

                            if (connectorLooped.id === connectorTested.id) {

                                connectorLooped.check_in_progress = false;
                                connectorLooped.seems_ok = connectorTested.seems_ok;
                                connectorLooped.raw_grants = connectorTested.raw_grants;
                            }

                            return connectorLooped;
                        });

                        setConnectors(connectorsUpdated);
                    },
                    callbackError: (error: any) => {

                        let connectorsUpdated = connectors.map((connectorLooped: TConnector) => {

                            if (connectorLooped.id === connector.id) {

                                connectorLooped.check_in_progress = false;
                                connectorLooped.seems_ok = false;
                                connectorLooped.raw_grants = error.message;
                            }

                            return connectorLooped;
                        });

                        setConnectors(connectorsUpdated);
                    }
                });
            }

        }

    }, [connectors, checkStarted]);

    // Trigger the API request to get all connectors and the external IP address of the API.
    //
    React.useEffect(() => {

        getApiServerIp();
        getConfConnectors(1);

    }, []);


    return (
        <>
            <div className="flex ">

                <div className="col-6">
                    <LaravelPaginator
                        paginateCallback={(page: number) => getConfConnectors(page)}
                        pagination={pagination}
                    />
                </div>

                <div className="col-4">
                    <div className="p-inputgroup">
                         <span className="p-inputgroup-addon">
                            <i className="pi pi-info-circle"/>
                        </span>
                        <span className="p-inputgroup-addon">
                            {t('settings:global_administration.connector.ip_address_to_authorize').toString()}
                        </span>
                        {apiServerIp}
                    </div>
                </div>

                <div className="col-1 col-offset-1">
                    <HelpButton helpCardPath="configure-connector"/>
                </div>
            </div>

            <Accordion activeIndex={0}>

                {connectors
                    .filter((connector: TConnector) => (!connector.global))
                    .map(
                        (connector: TConnector) => (
                            <AccordionTab key={connector.id} tabIndex={connector.id} header={
                                <>
                                    <span>{connector.name}</span>
                                    <i className={`pi ${connector.use_ssl ? 'pi-lock' : 'pi-lock-open'} ml-3 `}/>
                                    {!connector.check_in_progress
                                        && (connector.seems_ok
                                                ? <i className="pi pi-check ml-3 " style={{color: 'green'}}/>
                                                : <i className="pi pi-times ml-3" style={{color: 'red'}}/>
                                        )
                                    }
                                    {connector.check_in_progress &&
                                        <span className="ml-3">
                                            <MiniProgressSpinner widthHeightPx={16}/>
                                        </span>
                                    }
                                </>
                            }>
                                <ConnectorForm
                                    connector={connector}
                                    updateConnectorListCallback={() => {

                                        if (pagination) {

                                            paginationUpdate(pagination.current_page);
                                        }
                                    }}
                                />
                            </AccordionTab>
                        )
                    )}

                {/*I doubt someone will create one day 9999 connectors.*/}
                <AccordionTab key={9999}
                              tabIndex={9999}
                              header={
                                  <span>
                                   <i className="pi pi-plus mr-3"/>
                                      {t('settings:global_administration.connector.new_connector').toString()}
                               </span>
                              }
                              headerClassName="accordion-new-param"
                              contentClassName="accordion-new-param-content"
                >
                    <ConnectorForm
                        connector={{
                            id: 0,
                            name: '',
                            connector_database_id: 1,
                            global: false,
                            host: '',
                            port: 3306,
                            database: '',
                            username: '',
                            password: '',
                            timeout: 10,
                            connectorDatabase: {id: 1, name: 'MySQL'},
                            seems_ok: false,
                            raw_grants: '',
                            use_ssl: false,
                        }}
                        isNewConnector
                        updateConnectorListCallback={() => {

                            if (pagination) {

                                paginationUpdate(pagination.current_page);
                            }
                        }}
                    />
                </AccordionTab>
            </Accordion>
        </>
    );
};

export default ConnectorList;
