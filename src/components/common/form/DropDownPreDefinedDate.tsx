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

// import { Button }   from "primereact/button";
import { Dropdown }       from "primereact/dropdown";
import * as React         from 'react';
import { useTranslation } from "react-i18next";
import { Nullable }       from "primereact/ts-helpers";

export enum offSetType {
    DAYS,
    WEEKS,
    MONTHS,
    YEARS,
}

type preDefinedDateOption = {
    label: string,
    id: string,
    offset: number,
    offsetType: offSetType,
}

const DropDownPreDefinedDate: React.FC<{
    onChange: Function,
    values: preDefinedDateOption[],
    baseDate: Nullable<Date>,
}> = ({
          onChange,
          values,
                                        baseDate,
      }) => {

    const {t} = useTranslation('common');

    const handleClick = (offset: number, offsetType: offSetType) => {

        const date = baseDate || new Date();

        switch (offsetType) {
            case offSetType.DAYS:
                date.setDate(date.getDate() + offset);
                break;
            case offSetType.WEEKS:
                date.setDate(date.getDate() + (7 * offset));
                break;
            case offSetType.MONTHS:
                date.setMonth(date.getMonth() + offset);
                break;
            case offSetType.YEARS:
                date.setFullYear(date.getFullYear() + offset);
                break;
        }
        onChange(date);
    }

    return (
        <Dropdown value={1}
                  options={values.map((value) => ({name: value.label, code: value.id}))}
                  onChange={(event) => {

                      const preDefinedDateOption = values.find((value) => {
                          return value.id === event.value.code
                      });

                      if (preDefinedDateOption) {

                          handleClick(preDefinedDateOption.offset, preDefinedDateOption.offsetType)
                      }
                        return false;
                  }}
                  optionLabel="name"
                  placeholder={t('common:dates.same_date_there_was').toString()}
        />
    )


    // return (
    //     <span className="p-selectbutton p-buttonset">
    //         {values.map(value => (
    //             <Button
    //                 type="button"
    //                 key={value.id}
    //                 label={value.label}
    //                 onClick={() => handleClick(value.offset, value.offsetType)}
    //             />
    //         ))}
    //     </span>
    // )
}

export default DropDownPreDefinedDate;