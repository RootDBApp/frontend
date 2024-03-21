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

import { Dropdown, DropdownProps } from "primereact/dropdown";
import * as React                  from "react";
import { useTranslation }          from "react-i18next";

import apiDataContext from "../../../contexts/api_data/store/context";
import TReport        from "../../../types/TReport";

const DropDownReport: React.FC<{
    id: string,
    isInvalid: boolean,
    excludedReportIds?: Array<number>
} & DropdownProps> = ({
                          id,
                          isInvalid,
                          excludedReportIds,
                          ...props
                      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);

    const {state: apiDataState} = React.useContext(apiDataContext);

    return (
        <Dropdown
            {...props}
            name={id}
            optionLabel="name"
            optionValue="id"
            options={apiDataState.reports.filter((report: TReport) => {

                return !(excludedReportIds && excludedReportIds.find((reportId: number) => reportId === report.id));
            })}
            placeholder={t('report:form.choose_report').toString()}
            filter
            // isLoading={apiDataState.formconnectorsLoading}
            className={`flex ${isInvalid ? 'p-invalid w-full' : 'w-full'}`}
            virtualScrollerOptions={{ itemSize: 35.2 }}
        />
    )
};


export default DropDownReport;