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