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

import { SelectButton, SelectButtonProps } from "primereact/selectbutton";
import * as React                          from "react";

import apiDataContext from "../../../contexts/api_data/store/context";


const SelectButtonRoles: React.FC<{
    id: string,
    isInvalid: boolean,
    values: Array<number>
} & SelectButtonProps> = ({id, isInvalid, values, ...props}): React.ReactElement => {

    const [roleValues, setRoleValues] = React.useState<Array<number>>([]);
    const {state: apiDataState} = React.useContext(apiDataContext);

    React.useEffect(() => {

        let roleIds: Array<number> = []
        for (const roleId of values) {
            roleIds.push(roleId)
        }

        setRoleValues(roleIds);

    }, [values]);


    return <SelectButton
        {...props}
        name={id}
        value={roleValues}
        options={apiDataState.roles}
        optionLabel="name"
        optionValue="id"
        className={isInvalid ? 'p-invalid w-full' : 'w-full'}
        multiple
    />
};

export default SelectButtonRoles;