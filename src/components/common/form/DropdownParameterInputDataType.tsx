import { Dropdown, DropdownProps } from "primereact/dropdown";
import * as React                  from "react";
import { useTranslation }          from "react-i18next";

import apiDataContext                 from "../../../contexts/api_data/store/context";
import { getParameterInputDataTypes } from "../../../contexts/api_data/store/actions";

const DropdownParameterInputDataType: React.FC<{
    id: string,
    isInvalid: boolean
} & DropdownProps> = ({id, isInvalid, ...props}): React.ReactElement => {

    const {t} = useTranslation(['report']);
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const [tryCounter, setTryCounter] = React.useState<number>(0);

    React.useEffect(() => {

        if (tryCounter < 1 && apiDataState.parameterInputDataTypes.length === 0 && !apiDataState.parameterInputDataTypesLoading) {

            apiDataDispatch(getParameterInputDataTypes());
            setTryCounter(1);
        } else if (apiDataState.parameterInputDataTypes.length > 0) {

            setTryCounter(0);
        }
    }, [tryCounter, apiDataState.parameterInputDataTypes.length, apiDataState.parameterInputDataTypesLoading, apiDataDispatch]);

    return (
        <Dropdown
            {...props}
            name={id}
            optionLabel="name"
            optionValue="id"
            options={apiDataState.parameterInputDataTypes}
            placeholder={t('report:form.choose_parameter_input_data_type').toString()}
            filter
            // isLoading={apiDataState.formParameterInputDataTypesLoading}
            className={isInvalid ? 'p-invalid w-full' : 'w-full'}
        />
    )
};

export default DropdownParameterInputDataType;