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

import { Button }             from "primereact/button";
import { Dropdown }           from "primereact/dropdown";
import { MultiSelect }        from "primereact/multiselect";
import * as React             from "react";
import { useTranslation }     from "react-i18next";
import { Column }             from "@tanstack/react-table";


const SelectColumnFilter = ({ column, multiple, activeFilter } : { column: Column<any>, multiple: boolean, activeFilter: boolean }) => {

    const {t} = useTranslation('common');
    // Calculate the options for filtering
    // using the preFilteredRows

    const sortedUniqueValues = React.useMemo(
        () => Array.from(column.getFacetedUniqueValues().keys()).sort().map(v => ({ label: v, value: v})),
        [column]
    )

    // Render a multi-select box
    return (
        <div className="field mb-0">
            <div className="flex p-jc-between align-items-center">
                <label className="p-d-block" htmlFor={`column_filter_${column.id}`}>{t('common:list.filter')}</label>
                <Button
                    icon="pi pi-trash"
                    className={`p-button-rounded p-button-sm p-button-text ${activeFilter ? 'p-button-primary' : 'p-button-plain'}`}
                    type="button"
                    tooltip={t('common:list.reset_filter').toString()}
                    onClick={() => column.setFilterValue(undefined)}
                />
            </div>
            {multiple ? (
                <MultiSelect
                    inputId={`column_filter_${column.id}`}
                    value={column.getFilterValue()}
                    onChange={e => {
                        column.setFilterValue(e.value && e.value.length > 0 ? e.value : undefined)
                    }}
                    options={sortedUniqueValues}
                    style={{minWidth: '12rem', maxWidth: "25rem"}}
                    filter
                    virtualScrollerOptions={{ itemSize: 36 }}
                    // maxSelectedLabels={3}
                    // selectedItemsLabel={t("common:list.x-selected-items").toString()}
                />
            ) : (
                <Dropdown
                    inputId={`column_filter_${column.id}`}
                    value={column.getFilterValue()}
                    onChange={e => {
                        column.setFilterValue(e.value || undefined)
                    }}
                    options={[{label: t('common:list.all').toString(), value: null}, ...sortedUniqueValues]}
                    style={{minWidth: '12rem'}}
                    filter
                    virtualScrollerOptions={{ itemSize: 35.2 }}
                />
            )}
        </div>
    )
};

export default SelectColumnFilter;