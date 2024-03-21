/*
 * This file is part of RootDB.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * AUTHORS
 * PORQUET Sébastien <sebastien.porquet@ijaz.fr>
 * ROBIN Brice <brice@robri.net>
 */

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