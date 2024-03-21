import { InputTextareaProps }                        from "primereact/inputtextarea";
import { Mention, MentionProps, MentionSearchEvent } from "primereact/mention";
import * as React                                    from 'react';

import TReportParameter        from "../../../types/TReportParameter";
import TReportParameterMention from "../../../types/TReportParameterMention";


const ReportParameterPlaceholderAutocomplete: React.FC<{ parameters: Array<TReportParameter> }
    & MentionProps
    & InputTextareaProps> = ({
                                 parameters,
                                 ...props
                             }): React.ReactElement => {

    const [suggestions, setSuggestions] = React.useState<Array<TReportParameterMention>>([]);

    const onSearch = (event: MentionSearchEvent) => {

        setTimeout(() => {

            const query = event.query;
            let suggestionsProposed: Array<TReportParameterMention>;

            suggestionsProposed = parameters.map(
                (reportParameter: TReportParameter) => ({
                    variable_name: `${reportParameter.variable_name}]`,
                    name: reportParameter.name,
                    parameter_type: ((reportParameter.parameter_input && reportParameter.parameter_input.parameter_input_type && reportParameter.parameter_input.parameter_input_type.name) ? reportParameter.parameter_input.parameter_input_type.name : '')
                }))

            if (query.trim().length > 0) {

                suggestionsProposed = suggestionsProposed.filter((reportParameter: TReportParameterMention) => {

                    return reportParameter.name.toLowerCase().startsWith(query.toLowerCase()) || reportParameter.variable_name.toLowerCase().startsWith(query.toLowerCase());
                });
            }

            setSuggestions(suggestionsProposed);
        }, 250);
    }

    const itemTemplate = (item: TReportParameterMention) => {

        return (
            <span><strong>{item.name}</strong>, [{item.variable_name}, {item.parameter_type}</span>
        );
    }

    return (
        <Mention
            suggestions={suggestions}
            onSearch={onSearch}
            field="variable_name"
            itemTemplate={itemTemplate}
            trigger="["
            className="w-full"
            {...props}
        />
    )
};

export default ReportParameterPlaceholderAutocomplete;