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

import * as React         from 'react';
import { Button }         from "primereact/button";
import { useTranslation } from "react-i18next";
import TReportParameter   from "../../../types/TReportParameter";

const ReportParametersAndColumnsBinder: React.FC<{
    reportParameters?: TReportParameter[],
    columns?: Array<string>,
    onReportParameterClick: Function,
    onColumnClick: Function,
}> = ({
          reportParameters = [],
          columns = [],
          onReportParameterClick,
          onColumnClick
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);

    return (
        <>
            <div className="flex flex-row mt-3">
                {reportParameters && reportParameters.length > 0 && (
                    <div className="col-6 flex flex-column">
                        <strong>{t('report:report_link.report_parameter').toString()}</strong>
                        <ul className="report-column-binder flex-grow-1">
                            {reportParameters.map(p => (
                                <li key={p.id}>
                                    <Button
                                        type="button"
                                        text
                                        className="p-button-secondary w-full"
                                        onClick={() => onReportParameterClick(p.variable_name)}
                                    >
                                        {p.variable_name}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {columns && columns.length > 0 && (
                    <div className="col-6 flex flex-column">
                        <strong>{t('report:report_link.column_value').toString()}</strong>
                        <ul className="report-column-binder flex-grow-1">
                            {columns.map(column => (
                                <li key={column}>
                                    <Button
                                        type="button"
                                        text
                                        className="p-button-secondary w-full"
                                        onClick={() => onColumnClick(column)}
                                    >
                                        {column}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
}

export default ReportParametersAndColumnsBinder;