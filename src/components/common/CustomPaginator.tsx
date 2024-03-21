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

import {
    Paginator,
    PaginatorProps,
    PaginatorRowsPerPageDropdownOptions,
    PaginatorTemplate
}                      from "primereact/paginator";
import { InputNumber } from "primereact/inputnumber";
import * as React      from 'react';


const CustomPaginator: React.FC<PaginatorProps> = (props) => {

    const template: PaginatorTemplate = {

        layout: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
        FirstPageLink: (options: any) => {
            return options.element;
        },
        PrevPageLink: (options: any) => {
            return options.element;
        },
        PageLinks: (options: any) => {
            return options.element;
        },
        NextPageLink: (options: any) => {
            return options.element;
        },
        LastPageLink: (options: any) => {
            return options.element;
        },
        CurrentPageReport: (options: any) => {
            return options.element;
        },
        JumpToPageInput: (options: any) => {
            return options.element;
        },
        RowsPerPageDropdown: (options: PaginatorRowsPerPageDropdownOptions) => {
            return (
                <InputNumber
                    value={options.value}
                    // @ts-ignore
                    onValueChange={options.onChange}
                    mode="decimal"
                    showButtons
                    min={0}
                    max={props.totalRecords}
                    step={10}
                    inputStyle={{width: '4rem'}}
                />
            );
        },
    }
    return (
        <Paginator
            {...props}
            template={template}
        />
    )
};

export default CustomPaginator;