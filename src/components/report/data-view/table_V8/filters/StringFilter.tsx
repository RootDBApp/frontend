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

import { Button }         from "primereact/button";
import { InputText }      from "primereact/inputtext";
import * as React         from "react";
import { useTranslation } from "react-i18next";
import { Column }         from "@tanstack/react-table";

const StringFilterV8 = ({column, activeFilter}: { column: Column<any, unknown>, activeFilter: boolean }) => {

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