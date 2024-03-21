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