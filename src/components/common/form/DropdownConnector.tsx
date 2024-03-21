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

import apiDataContext             from "../../../contexts/api_data/store/context";
import { getConnectors }          from "../../../contexts/api_data/store/actions";
import TConnector                 from "../../../types/TConnector";
import { context as authContext } from "../../../contexts/auth/store/context";
import { filterConnectors }       from "../../../utils/tools";

const DropdownConnector: React.FC<{
    id: string,
    isInvalid: boolean,
    defaultValue?: number,
    excludeConnectorIds?: Array<number>,
    includeGlobalConnector?: boolean
    selectFirst?: boolean,
} & DropdownProps> = ({
                          id,
                          isInvalid,
                          defaultValue,
                          excludeConnectorIds,
                          includeGlobalConnector = false,
                          selectFirst,
                          ...props
                      }): React.ReactElement => {

    const {t} = useTranslation(['report']);
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const {state: authState} = React.useContext(authContext);

    const [tryCounter, setTryCounter] = React.useState<number>(0);
    const [value, setValue] = React.useState<number>(0);
    const [filteredConnectors, setFilteredConnectors] = React.useState<Array<TConnector>>([]);

    // Used to get data from API is not already in web browser cache.
    //
    React.useEffect(() => {

        if (tryCounter < 1 && apiDataState.connectors.length === 0 && !apiDataState.connectorsLoading) {

            apiDataDispatch(getConnectors());
            setTryCounter(1);
        } else if (apiDataState.connectors.length > 0) {


            setFilteredConnectors(filterConnectors(apiDataState.connectors, excludeConnectorIds));
            setTryCounter(0);
        }
    }, [
        tryCounter,
        apiDataState.connectors.length,
        apiDataState.connectorsLoading,
        apiDataDispatch,
        apiDataState.connectors,
        selectFirst,
        excludeConnectorIds
    ]);


    // Used to select a custom value if asked.
    //
    React.useEffect(() => {

        if (filteredConnectors.length > 0 && selectFirst) {

            if (defaultValue) {

                setValue(defaultValue)
            } else if (selectFirst) {

                setValue(filteredConnectors.find(
                        (connector: TConnector) => {

                            if (!connector.global) {

                                return connector;
                            }

                            return undefined;
                        })?.id
                    ?? 0
                );
            }
        } else if (defaultValue) {

            setValue(defaultValue)
        }

    }, [defaultValue, filteredConnectors, selectFirst]);

    return (
        <Dropdown
            {...props}
            name={id}
            optionLabel="name"
            optionValue="id"
            options={filteredConnectors
                .filter((connector: TConnector) => {

                    return !(!includeGlobalConnector && connector.global);
                })
                .map((connector: TConnector) => {

                    let connectorModified = connector;
                    if (connectorModified.name === 'all connectors' && authState.user.organization_user.user_preferences.lang !== 'en') {

                        connectorModified.name = t('settings:global_administration.connector.all_connectors');
                    }
                    return connectorModified;
                })
            }
            placeholder={t('report:form.choose_connector').toString()}
            filter
            className={`flex ${isInvalid ? 'p-invalid w-full' : 'w-full'}`}
            value={value}
        />
    )
};

export default DropdownConnector;