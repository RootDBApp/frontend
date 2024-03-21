import { MultiSelect, MultiSelectProps } from "primereact/multiselect";
import * as React                        from "react";
import { useTranslation }                from "react-i18next";

import apiDataContext from "../../../contexts/api_data/store/context"
import { getGroups }  from "../../../contexts/api_data/store/actions";


const MultiSelectGroup: React.FC<{
    id: string,
    isInvalid: boolean,
    values: Array<number>
} & MultiSelectProps> = ({id, isInvalid, values, ...props}): React.ReactElement => {

    const {t} = useTranslation(['report']);
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const [value, setValue] = React.useState<Array<number>>([]);
    const [tryCounter, setTryCounter] = React.useState<number>(0);

    React.useEffect(() => {

        if (tryCounter < 1 && apiDataState.groups.length === 0 && !apiDataState.groupsLoading) {

            apiDataDispatch(getGroups());
            setTryCounter(1);
        } else if (apiDataState.groups.length > 0 && !apiDataState.groupsLoading) {

            setTryCounter(0);
            setValue(values)
        }
    }, [tryCounter, apiDataState.groups.length, apiDataState.groupsLoading, apiDataDispatch, values]);

    return (<MultiSelect
            {...props}
            name={id}
            optionLabel="name"
            optionValue="id"
            placeholder={t('report:form.choose_groups').toString()}
            value={value}
            options={apiDataState.groups}
            filter
            className={isInvalid ? 'p-invalid w-full' : 'w-full'}
            display="chip"
            scrollHeight="400px"
        />
    )
};

export default MultiSelectGroup;