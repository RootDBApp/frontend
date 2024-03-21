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

import * as React      from 'react';
import { useLocation } from "react-router-dom";

import PublicReport                                                      from "../report/PublicReport";
import { extractReportInstanceIdFromReportUniqId, generateReportUniqId } from "../../utils/tools";

export default function PublicRoute(): React.ReactElement {

    let location = useLocation();
    const [reportId, setReportId] = React.useState<number>(0);
    const [securityHash, setSecurityHash] = React.useState<string>('');

    const locationMatches = React.useMemo(() => {

        return new RegExp('report/([0-9]{1,10})').exec(location.pathname);
    }, [location.pathname]);

    const locationSearch = React.useMemo(() => {

        return new URLSearchParams(location.search);
    }, [location.search]);

    React.useEffect(() => {

        if (locationMatches) {

            setReportId(Number(locationMatches[1]));
        }

        if (locationSearch) {

            setSecurityHash(String(locationSearch.get('sh')));
        }

    }, [setReportId, setSecurityHash, locationSearch, locationMatches]);

    return <PublicReport
        reportId={reportId}
        instanceId={extractReportInstanceIdFromReportUniqId(generateReportUniqId(reportId))}
        securityHash={securityHash}
    />
}
