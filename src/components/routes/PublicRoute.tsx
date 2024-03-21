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
