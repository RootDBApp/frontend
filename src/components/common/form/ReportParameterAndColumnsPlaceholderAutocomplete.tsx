import { InputTextareaProps }                        from "primereact/inputtextarea";
import { Mention, MentionProps, MentionSearchEvent } from "primereact/mention";
import * as React                                    from 'react';

import TReportParameter                from "../../../types/TReportParameter";
import TReportParameterOrColumnMention from "../../../types/TReportParameterOrColumnMention";
import TSQLResultColumn                from "../../../types/TSQLResultColumn";


const ReportParameterAndColumnsPlaceholderAutocomplete: React.FC<{
        parameters?: TReportParameter[],
        columns?: TSQLResultColumn[],
    }
    & MentionProps
    & InputTextareaProps> = ({
                                 parameters = [],
                                 columns = [],
                                 ...props
                             }): React.ReactElement => {

    const [suggestions, setSuggestions] = React.useState<Array<TReportParameterOrColumnMention>>([]);

    const onSearch = (event: MentionSearchEvent) => {
        const {trigger} = event;

        if (trigger === '[') { // report parameters

            setTimeout(() => {

                const query = event.query;
                let suggestionsProposed: Array<TReportParameterOrColumnMention>;

                suggestionsProposed = parameters.map(
                    (reportParameter: TReportParameter) => ({
                        variable_name: `${reportParameter.variable_name}]`,
                        name: reportParameter.name,
                        parameter_type: ((reportParameter.parameter_input && reportParameter.parameter_input.parameter_input_type && reportParameter.parameter_input.parameter_input_type.name) ? reportParameter.parameter_input.parameter_input_type.name : '')
                    }))

                if (query.trim().length > 0) {

                    suggestionsProposed = suggestionsProposed.filter((reportParameter: TReportParameterOrColumnMention) => {

                        return reportParameter.name?.toLowerCase().startsWith(query.toLowerCase()) || reportParameter.variable_name.toLowerCase().startsWith(query.toLowerCase());
                    });
                }

                setSuggestions(suggestionsProposed);
            }, 250);
        } else if (trigger === '{') { // columns

            setTimeout(() => {

                const query = event.query;
                let suggestionsProposed: Array<TReportParameterOrColumnMention>;

                suggestionsProposed = columns.map(
                    (column) => ({
                        variable_name: `${column.name}}`,
                    }))

                if (query.trim().length > 0) {

                    suggestionsProposed = suggestionsProposed.filter((column) => {

                        return column.variable_name.toLowerCase().startsWith(query.toLowerCase());
                    });
                }

                setSuggestions(suggestionsProposed);
            }, 250);
        }


    }

    const itemTemplate = (item: TReportParameterOrColumnMention) => {

        return (
            <span className="mention">
                {item.name && <strong>{item.name}</strong>}
                <span>{item.variable_name.substring(0, item.variable_name.length - 1) || ''}</span>
                <span>{item.parameter_type || ''}</span>
            </span>
        );
    }

    return (
        <Mention
            suggestions={suggestions}
            onSearch={onSearch}
            field="variable_name"
            itemTemplate={itemTemplate}
            trigger={['[', "{"]}
            className="w-full"
            {...props}
        />
    )
};

export default ReportParameterAndColumnsPlaceholderAutocomplete;