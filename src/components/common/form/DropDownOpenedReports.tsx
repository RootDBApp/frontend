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

import { Dropdown, DropdownProps }  from "primereact/dropdown";
import * as React                   from "react";
import { useTranslation }           from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import TReport              from "../../../types/TReport";
import { useOpenedReports } from "../../../utils/hooks";

const DropDownOpenedReports: React.FC<{} & DropdownProps> = (): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);
    const navigate = useNavigate();
    const location = useLocation();
    const openedReports = useOpenedReports();
    const [selectedReportId, setSelectedReportId] = React.useState<number>();

    React.useEffect(() => {

        const matchDebugReportId = new RegExp(/debug\/report\/(\d{1,10})/g).exec(location.pathname);

        if (matchDebugReportId) {

            // @ts-ignore
            setSelectedReportId(Number(matchDebugReportId[1]));
        }

    }, [location]);

    return (<>
            {!!openedReports && openedReports.length > 0
                ? <Dropdown value={selectedReportId}
                            onChange={(event) => {

                                setSelectedReportId(event.value);
                                navigate(`/debug/report/${event.value}`);
                            }}
                            options={openedReports.map(
                                (report: TReport) => {

                                    return {id: report.id, name: report.name}
                                }
                            )}
                            optionValue="id"
                            optionLabel="name"
                            placeholder={t('report:select_report').toString()}
                            className="w-full md:w-10rem"
                />
                : <></>
            }
        </>
    )
};


export default DropDownOpenedReports;