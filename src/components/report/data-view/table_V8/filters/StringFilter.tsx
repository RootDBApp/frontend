import { Button }         from "primereact/button";
import { InputText }      from "primereact/inputtext";
import * as React         from "react";
import { useTranslation } from "react-i18next";
import { Column }  from "@tanstack/react-table";

const StringFilterV8 = ({ column, activeFilter }: { column: Column<any, unknown>, activeFilter: boolean }) => {

    const id = column.id;
    const filterValue = column.getFilterValue();
    const {t} = useTranslation('common');
    return (
        <div className="field mb-0">
            <div className="flex p-jc-between align-items-center">
                <label className="p-d-block" htmlFor={`text_filter_${id}`}>{t('common:list.filter')}</label>
                <Button
                    icon="pi pi-trash"
                    className={`p-button-rounded p-button-sm p-button-text ${activeFilter ? 'p-button-primary' : 'p-button-plain'}`}
                    type="button"
                    tooltip={t('common:list.reset_filter').toString()}
                    onClick={() => column.setFilterValue(undefined)}
                />
            </div>
            <InputText
                className="p-inputtext-sm"
                id={`text_filter_${id}`}
                value={String(filterValue || '')}
                onChange={(e) => {
                    const value = (e.target as HTMLInputElement).value;
                    column.setFilterValue(value !== '' ? value : undefined);
                }}
            />
        </div>
    );
};

export default StringFilterV8;