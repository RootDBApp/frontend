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