import { MultiSelect, MultiSelectProps } from "primereact/multiselect";
import * as React                        from "react";
import { useTranslation }                from "react-i18next";

import apiDataContext from "../../../contexts/api_data/store/context";
import { getUsers }   from "../../../contexts/api_data/store/actions";
import TUser          from "../../../types/TUser";

const MultiSelectUser: React.FC<{
    id: string,
    isInvalid: boolean,
    values: Array<number>,
    users?: Array<TUser>
} & MultiSelectProps> = ({id, isInvalid, values, users, ...props}): React.ReactElement => {

    const {t} = useTranslation(['report']);
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const [value, setValue] = React.useState<Array<number>>([]);
    const [tryCounter, setTryCounter] = React.useState<number>(0);

    React.useEffect(() => {

        if (users && users.length > 0) {

            setValue(values);
        } else {

            if (tryCounter < 1 && apiDataState.users.length === 0 && !apiDataState.usersLoading) {

                apiDataDispatch(getUsers());
                setTryCounter(1);
            } else if (apiDataState.users.length > 0 && !apiDataState.usersLoading) {

                setTryCounter(0);
                setValue(values);
            }
        }

    }, [users, tryCounter, apiDataState.users.length, apiDataState.usersLoading, apiDataDispatch, values]);

    return (
        <MultiSelect
            {...props}
            name={id}
            optionLabel="name"
            optionValue="id"
            placeholder={t('report:form.choose_users').toString()}
            value={value}
            options={users && users.length > 0 ? users : apiDataState.users}
            filter
            className={isInvalid ? 'p-invalid w-full' : 'w-full'}
            display="chip"
            scrollHeight="400px"
            virtualScrollerOptions={{ itemSize: 36 }}
        />
    )
};

export default MultiSelectUser;