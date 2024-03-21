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