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

import { AutoComplete }   from "primereact/autocomplete";
import * as React         from "react";
import { useTranslation } from "react-i18next";
import { useNavigate }    from "react-router-dom";

import apiDataContext           from "../../../contexts/api_data/store/context";
import TReport                  from "../../../types/TReport";
import { generateReportUniqId } from "../../../utils/tools";

const AutoCompleteReport: React.FC<{
    setInPlaceActive: CallableFunction,
    autoFocus?: boolean,
}> = ({
          setInPlaceActive,
          autoFocus = true,
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);
    const navigate = useNavigate();

    const {state: apiDataState} = React.useContext(apiDataContext);
    const [selectedReport, setSelectedReport] = React.useState<string>('');
    const [filteredReports, setFilteredReports] = React.useState<Array<TReport>>([]);
    const [suggestionsShown, setSuggestionsShown] = React.useState(false);

    const searchReport = (event: { query: string }): void => {

        setFilteredReports(apiDataState.reports.filter((report: TReport) => {
            return report.name.toLowerCase().match(event.query.toLowerCase());
        }))
    };

    const handleOnChange = (event: { value: TReport }): void => {

        setInPlaceActive(false);
        navigate(`/report/${generateReportUniqId(event.value.id)}?run`);
    }

    return (
        <>
            <AutoComplete
                autoFocus={autoFocus}
                onKeyUp={event => {
                    if (event.key === 'Escape') {

                        setInPlaceActive(false);
                    }
                }}
                onBlur={() => {
                    if (!suggestionsShown) {

                        setInPlaceActive(false)
                    }
                }}
                onShow={() => setSuggestionsShown(true)}
                onHide={() => setSuggestionsShown(false)}
                inputClassName="p-inputtext-sm "
                value={selectedReport}
                suggestions={filteredReports}
                completeMethod={searchReport}
                field="name"
                onChange={(event) => setSelectedReport(event.value)}
                onSelect={(event) => {
                    handleOnChange(event)
                }}
                placeholder={t('report:form.search_report').toString()}
            />
        </>
    );
}
export default AutoCompleteReport;