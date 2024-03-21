import { Dropdown, DropdownProps } from "primereact/dropdown";
import { SelectItem }              from "primereact/selectitem";
import * as React                  from "react";
import { useTranslation }          from "react-i18next";

import { EWeekDay } from "../../../types/EWeekDay";

const DropdownWeekDay: React.FC<{
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

    const [days, setDays] = React.useState<Array<SelectItem>>([]);

    React.useEffect(() => {

        let days: Array<SelectItem> = [];
        Object.values(EWeekDay).forEach((day: string) => {
            days.push({label: t('widget:dropdown_week_day.' + day).toString(), value: day});
        });

        setDays(days);
    }, [t]);

    return (

        <Dropdown
            {...props as DropdownProps}
            name={id}
            options={days}
            placeholder={t('widget:dropdown_week_day.choose_weekday').toString()}
            filter
            className={`w-full ${isInvalid ? 'p-invalid' : ''}`}
        />
    )
};

export default DropdownWeekDay;