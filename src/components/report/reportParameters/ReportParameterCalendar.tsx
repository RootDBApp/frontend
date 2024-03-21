import { Calendar }       from "primereact/calendar";
import { Dropdown }       from "primereact/dropdown";
import * as React         from "react";
import { useTranslation } from "react-i18next";

import TReportParameter                       from "../../../types/TReportParameter";
import DropDownPreDefinedDate, { offSetType } from "../../common/form/DropDownPreDefinedDate";
import { TNameValue }                         from "../../../types/TNameValue";
import { context as authContext }             from "../../../contexts/auth/store/context";
import { Button }                             from "primereact/button";

const ReportParameterCalendar: React.FC<{
    parameter: TReportParameter,
    index: number,
    parameterId: string,
    onChange: CallableFunction,
    formValue?: TNameValue,
}> = ({
          index,
          parameter,
          parameterId,
          onChange,
          formValue
      }): React.ReactElement => {

    const {state: authState} = React.useContext(authContext);

    const {t} = useTranslation('common');
    const [value, setValue] = React.useState<Date | undefined>(undefined);
    const [randomKey, setRandomKey] = React.useState<number>(Math.random() * 100);

    const defaultValue = React.useMemo(() => {
        if (parameter.forced_default_value) {

            return new Date(parameter.forced_default_value);
        }

        if (parameter?.parameter_input?.default_value) {

            return new Date(parameter.parameter_input.default_value);
        }
    }, [parameter.forced_default_value, parameter.parameter_input?.default_value])

    React.useEffect(() => {
        if (formValue) {
            if (String(formValue.value).indexOf('/') !== -1) {

                const dateFragments = String(formValue.value).split('/');
                setValue(new Date(dateFragments[2] + '-' + dateFragments[1] + '-' + dateFragments[0]));
            } else {

                setValue(new Date(String(formValue.value)));
            }
            // do nothing.
        } else if (defaultValue) {

            setValue(new Date(defaultValue));
        }
    }, [formValue, defaultValue, parameter.variable_name]);

    const monthNavigatorTemplate = (e: any) => {
        return <Dropdown
            value={e.value}
            options={e.options}
            onChange={(event) => e.onChange(event.originalEvent, event.value)}
            style={{lineHeight: 1}}
        />;
    }

    const yearNavigatorTemplate = (e: any) => {
        return <Dropdown
            value={e.value}
            options={e.options}
            onChange={(event) => e.onChange(event.originalEvent, event.value)}
            className="p-ml-2"
            style={{lineHeight: 1}}
        />;
    }

    return (
        <Calendar
            key={String('parameters_form_input_calendar_' + parameterId + '_' + index + '_' + randomKey)}
            id={'parameters_form_input_calendar_' + parameterId + '_' + index}
            name={parameter.variable_name}
            value={value}
            viewDate={value}
            dateFormat="yy-mm-dd"
            locale={authState.user.organization_user.user_preferences.lang}
            onChange={(event) => onChange(event)}
            onViewDateChange={(event) => onChange(event)}
            className="w-full"
            showIcon
            monthNavigator
            yearNavigator
            yearRange="1900:3000"
            monthNavigatorTemplate={monthNavigatorTemplate}
            yearNavigatorTemplate={yearNavigatorTemplate}
            footerTemplate={() => (
                <div className="flex flex align-items-center justify-content-evenly gap-1">
                    <DropDownPreDefinedDate
                        onChange={(date: Date) => {
                            setValue(date);
                            onChange({value: date})
                            setRandomKey(Math.random() * 100);
                        }}
                        baseDate={value}
                        values={[
                            {
                                id: "1week",
                                label: t('common:dates.week', {count: 1}).toString(),
                                offset: -1,
                                offsetType: offSetType.WEEKS
                            },
                            {
                                id: "2weeks",
                                label: t('common:dates.week', {count: 2}).toString(),
                                offset: -2,
                                offsetType: offSetType.WEEKS
                            },
                            {
                                id: "3weeks",
                                label: t('common:dates.week', {count: 3}).toString(),
                                offset: -3,
                                offsetType: offSetType.WEEKS
                            },
                            {
                                id: "4weeks",
                                label: t('common:dates.week', {count: 4}).toString(),
                                offset: -4,
                                offsetType: offSetType.WEEKS
                            },
                            {
                                id: "1month",
                                label: t('common:dates.month', {count: 1}).toString(),
                                offset: -1,
                                offsetType: offSetType.MONTHS
                            },
                            {
                                id: "2month",
                                label: t('common:dates.month', {count: 2}).toString(),
                                offset: -2,
                                offsetType: offSetType.MONTHS
                            },
                            {
                                id: "3month",
                                label: t('common:dates.month', {count: 3}).toString(),
                                offset: -3,
                                offsetType: offSetType.MONTHS
                            },
                            {
                                id: "4month",
                                label: t('common:dates.month', {count: 4}).toString(),
                                offset: -4,
                                offsetType: offSetType.MONTHS
                            },
                            {
                                id: "5month",
                                label: t('common:dates.month', {count: 5}).toString(),
                                offset: -5,
                                offsetType: offSetType.MONTHS
                            },
                            {
                                id: "6month",
                                label: t('common:dates.month', {count: 6}).toString(),
                                offset: -6,
                                offsetType: offSetType.MONTHS
                            },
                            {
                                id: "1year",
                                label: t('common:dates.year', {count: 1}).toString(),
                                offset: -1,
                                offsetType: offSetType.YEARS
                            },
                            {
                                id: "2years",
                                label: t('common:dates.year', {count: 2}).toString(),
                                offset: -2,
                                offsetType: offSetType.YEARS
                            },
                        ]}
                    />
                    {defaultValue && (
                        <Button label={t('common:dates.default').toString()} outlined onClick={() => setValue(new Date(defaultValue))}/>
                    )}
                    <Button label={t('common:dates.today').toString()} outlined onClick={() => setValue(new Date())}/>
                </div>
            )}
        />);
}

export default ReportParameterCalendar;