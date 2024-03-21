import { Dropdown, DropdownProps } from "primereact/dropdown";
import * as React                  from "react";
import { useTranslation }          from "react-i18next";

import apiDataContext            from "../../../contexts/api_data/store/context";
import { getConnectorDatabases } from "../../../contexts/api_data/store/actions";
import { Button }                from "primereact/button";
import TConnectorDatabase        from "../../../types/TConnectorDatabase";

const DropdownConnectorDatabase: React.FC<{
    id: string,
    isInvalid: boolean
} & DropdownProps> = ({id, isInvalid, ...props}): React.ReactElement => {

    const {t} = useTranslation(['report']);
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const [tryCounter, setTryCounter] = React.useState<number>(0);

    React.useEffect(() => {

        if (tryCounter < 1 && apiDataState.connectorDatabases.length === 0 && !apiDataState.connectorDatabasesLoading) {

            apiDataDispatch(getConnectorDatabases());
            setTryCounter(1);
        } else if (apiDataState.connectorDatabases.length > 0) {

            setTryCounter(0);
        }
    }, [tryCounter, apiDataState.connectorDatabases.length, apiDataState.connectorDatabasesLoading, apiDataDispatch]);

    return (
        <div className="p-inputgroup">
            <Dropdown
                {...props}
                name={id}
                optionLabel="name"
                optionValue="id"
                optionDisabled={(connectorDatabase: TConnectorDatabase) => !connectorDatabase.available}
                options={apiDataState.connectorDatabases}
                placeholder={t('report:form.choose_connector').toString()}
                // isLoading={apiDataState.formconnectorsLoading}
                className={`flex ${isInvalid ? 'p-invalid w-full' : 'w-full'}`}
            />
            <Button
                icon="pi pi-refresh"
                aria-label="Refresh"
                onClick={(event) => {
                    event.preventDefault();

                    apiDataDispatch(getConnectorDatabases());
                }}
            />
        </div>
    )
};

export default DropdownConnectorDatabase;