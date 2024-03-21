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