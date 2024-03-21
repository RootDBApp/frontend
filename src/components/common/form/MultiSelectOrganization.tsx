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

import { MultiSelect, MultiSelectProps } from "primereact/multiselect";
import * as React                        from "react";
import { useTranslation }                from "react-i18next";

import TOrganization              from "../../../types/TOrganization";
import { context as authContext } from "../../../contexts/auth/store/context";


const MultiSelectOrganization: React.FC<{
    id: string,
    isInvalid: boolean,
    values: Array<number>,
} & MultiSelectProps> = ({id, isInvalid, values, ...props}): React.ReactElement => {

    const {t} = useTranslation(['report', 'settings']);
    const {state: authState} = React.useContext(authContext);

    const [organizations, setOrganizations] = React.useState<Array<TOrganization>>([]);
    const [value, setValue] = React.useState<Array<number>>([]);

    React.useEffect(() => {

        if (organizations.length > 0) {

            setValue(values);
        } else {

            setOrganizations(authState.user.organization_users?.map(organizationUser => organizationUser.organization));
        }

    }, [organizations, authState.user.organization_users, values]);

    return (
        <MultiSelect
            {...props}
            name={id}
            optionLabel="name"
            optionValue="id"
            placeholder={t('report:form.choose_organizations').toString()}
            value={value}
            options={organizations}
            filter
            className={isInvalid ? 'p-invalid w-full' : 'w-full'}
            display="chip"
            scrollHeight="400px"
        />
    )
};

export default MultiSelectOrganization;