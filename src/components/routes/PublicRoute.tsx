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

import * as React                   from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import PublicReport                                                      from "../report/PublicReport";
import { extractReportInstanceIdFromReportUniqId, generateReportUniqId } from "../../utils/tools";
import CenteredLoading                                                   from "../common/loading/CenteredLoading";

export default function PublicRoute(): React.ReactElement {

    const location = useLocation();
    const navigate = useNavigate();
    const [reportId, setReportId] = React.useState<number>(0);
    const [securityHash, setSecurityHash] = React.useState<string>('');
    const [instanceId, setInstanceId] = React.useState<number>();

    React.useEffect(() => {
        let reportId;
        const locationMatches = new RegExp('report/([0-9]{1,10})').exec(location.pathname);
        const locationSearch = new URLSearchParams(location.search);
        if (locationMatches) {
            reportId = Number(locationMatches[1]);
            setReportId(reportId);

            if (locationSearch) {

                setSecurityHash(String(locationSearch.get('sh')));

                const urlInstanceId = Number(locationSearch.get('instanceId'));
                if (urlInstanceId) {
                    setInstanceId(urlInstanceId);
                } else {
                    navigate(`${location.pathname}?${locationSearch}&instanceId=${extractReportInstanceIdFromReportUniqId(generateReportUniqId(reportId))}`);
                }
            }
        }
    }, [location, navigate]);

    if (!reportId || !instanceId) {
        return <CenteredLoading />
    }

    return <PublicReport
        reportId={reportId}
        instanceId={instanceId}
        securityHash={securityHash}
    />
}
