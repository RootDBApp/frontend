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