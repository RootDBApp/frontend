import { Dropdown, DropdownProps } from "primereact/dropdown";
import * as React                  from "react";
import { useTranslation }          from "react-i18next";

import apiDataContext         from "../../../contexts/api_data/store/context";
import { getParameterInputs } from "../../../contexts/api_data/store/actions";
import TParameterInput        from "../../../types/TParameterInput";


const DropdownParameterInput: React.FC<{
    id: string,
    isInvalid: boolean
    confConnectorId?: number
} & DropdownProps> = ({id, isInvalid, confConnectorId, ...props}): React.ReactElement => {

    const {t} = useTranslation(['report']);
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const [tryCounter, setTryCounter] = React.useState<number>(0);

    React.useEffect(() => {

        if (tryCounter < 1 && apiDataState.parameterInputs.length === 0 && !apiDataState.parameterInputsLoading) {

            apiDataDispatch(getParameterInputs());
            setTryCounter(1);
        } else if (apiDataState.parameterInputs.length > 0) {

            setTryCounter(0);
        }
    }, [tryCounter, apiDataState.parameterInputs.length, apiDataState.parameterInputsLoading, apiDataDispatch]);

    return (
        <Dropdown
            {...props}
            name={id}
            optionLabel="name"
            optionValue="id"
            placeholder={t('report:form.choose_parameter').toString()}
            options={apiDataState.parameterInputs.filter((parameterInput: TParameterInput) => {

                let addThisParameter = true;
                if (confConnectorId && confConnectorId > 0) {

                    addThisParameter = parameterInput.conf_connector_id === confConnectorId
                }

                if (!addThisParameter && parameterInput.conf_connector?.global) {

                    addThisParameter = true;
                }

                return addThisParameter;
            })}
            filter
            className={`flex ${isInvalid ? 'p-invalid ' : ''}`}
            scrollHeight="400px"
            panelClassName="dropdown-in-dialog-in-accordion-z-index"
            virtualScrollerOptions={{ itemSize: 35.2 }}
        />
    )
};

export default DropdownParameterInput;
