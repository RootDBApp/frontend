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

import * as React from 'react';

import TJSModuleImport                     from "../../../types/TJSmoduleImport";
import TReportDataViewState                from "../../../types/TReportDataViewState";
import ReportDataViewFormModuleImportsForm from "./ReportDataViewFormModuleImportsForm";

const ReportDataViewFormModuleImportsList: React.FC<{
    reportDataViewState: TReportDataViewState
}> = ({
          reportDataViewState,
      }) => {

    const [numModules, setNumModules] = React.useState<number>(0);

    React.useEffect(() => {

        if (numModules > 0) {
            setNumModules(0);
        }
    }, [numModules]);

    return (<>
        {reportDataViewState.dataView?.report_data_view_js?.json_runtime_configuration?.jsModules.map((jsModuleImport: TJSModuleImport) => (
            <ReportDataViewFormModuleImportsForm
                key={`jsmodule-import-${reportDataViewState.report?.id}-${reportDataViewState.dataView?.id}-${jsModuleImport.id}`}
                jsModuleImport={jsModuleImport}
                reportDataViewState={reportDataViewState}
                callbackOnDataViewJsModuleUpdated={(numModules: number) => {

                    setNumModules(numModules);
                }}
            />
        ))}
        <ReportDataViewFormModuleImportsForm
            key={`jsmodule-import-${reportDataViewState.report?.id}-${reportDataViewState.dataView?.id}-99999`}
            jsModuleImport={{id: 0, url: '', as: ''}}
            reportDataViewState={reportDataViewState}
            callbackOnDataViewJsModuleUpdated={(numModules: number) => {

                setNumModules(numModules);
            }}
        />
    </>);
}

export default ReportDataViewFormModuleImportsList;
