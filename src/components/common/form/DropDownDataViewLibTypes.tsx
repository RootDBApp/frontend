import { Dropdown, DropdownProps } from "primereact/dropdown";
import * as React                  from "react";
import { useTranslation }          from "react-i18next";

import apiDataContext          from "../../../contexts/api_data/store/context";
import { getDataViewLibTypes } from "../../../contexts/api_data/store/actions";
import TReportDataViewLibType  from "../../../types/TReportDataViewLibType";

const DropDownDataViewLibTypes: React.FC<{
    id: string,
    dataViewLibVersionId: number,
    isInvalid: boolean
} & DropdownProps> = ({id, dataViewLibVersionId, isInvalid, ...props}): React.ReactElement => {

    const {t} = useTranslation(['report']);
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const [tryCounter, setTryCounter] = React.useState<number>(0);

    React.useEffect(() => {

        if (tryCounter < 1 && apiDataState.dataViewLibTypes.length === 0 && !apiDataState.dataViewLibTypesLoading) {

            apiDataDispatch(getDataViewLibTypes());
            setTryCounter(1);
        } else if (apiDataState.dataViewLibTypes.length > 0) {

            setTryCounter(0);
        }

    }, [tryCounter, apiDataState.dataViewLibTypes.length, apiDataState.dataViewLibTypesLoading, apiDataDispatch]);

    return (
        <Dropdown
            {...props}
            name={id}
            optionLabel="name"
            optionValue="id"
            options={apiDataState.dataViewLibTypes.filter((libType: TReportDataViewLibType) => libType.report_data_view_lib_version_id === dataViewLibVersionId)}
            placeholder={t('report:form.choose_chart_model').toString()}
            // isLoading={apiDataState.dataViewLibVersionsLoading}
            className={`flex ${isInvalid ? 'p-invalid w-full' : 'w-full'}`}
        />
    )
};

export default DropDownDataViewLibTypes;