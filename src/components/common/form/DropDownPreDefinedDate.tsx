// import { Button }   from "primereact/button";
import { Dropdown }       from "primereact/dropdown";
import * as React         from 'react';
import { useTranslation } from "react-i18next";

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
    baseDate: Date | undefined,
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