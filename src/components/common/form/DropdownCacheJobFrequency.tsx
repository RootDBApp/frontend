import { Dropdown, DropdownProps } from "primereact/dropdown";
import { SelectItem }              from "primereact/selectitem";
import * as React                  from "react";
import { useTranslation }          from "react-i18next";

import { ECacheJobFrequency } from "../../../types/ECacheJobFrequency";

const DropdownCacheJobFrequency: React.FC<{
    id: string,
    isInvalid?: boolean,
    fullWidth?: boolean,
} & (DropdownProps)> = (
    {
        id,
        isInvalid = false,
        ...props
    }): React.ReactElement => {

    const {t} = useTranslation(['widget']);

    const [frequencies, setFrequencies] = React.useState<Array<SelectItem>>([]);

    React.useEffect(() => {

        let frequencies: Array<SelectItem> = [];
        Object.values(ECacheJobFrequency).forEach((frequency: string) => {
            frequencies.push({label: t('widget:dropdown_cache_job_frequency.' + frequency).toString(), value: frequency});
        });

        setFrequencies(frequencies);
    }, [t]);

    return (

        <Dropdown
            {...props as DropdownProps}
            name={id}
            options={frequencies}
            placeholder={t('widget:dropdown_cache_job_frequency.choose_frequency').toString()}
            filter
            className={`w-full ${isInvalid ? 'p-invalid' : ''}`}
        />
    )
};

export default DropdownCacheJobFrequency;