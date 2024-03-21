import * as React              from 'react';
import { useLocation }         from "react-router-dom";
import * as RTReport           from "../contexts/report/ReportContextProvider";
import TReport                 from "../types/TReport";
import { LocationKey, Search } from "history";


// TODO : test when using it twice in the same component, with 2 different callbacks
export function useDebouncedCallback<A extends any[]>(
    callback: (...args: A) => void,
    wait: number
) {
    // track args & timeout handle between calls
    const argsRef = React.useRef<A>();
    const timeout = React.useRef<ReturnType<typeof setTimeout>>();

    function cleanup() {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
    }

    // make sure our timeout gets cleared if
    // our consuming component gets unmounted
    React.useEffect(() => cleanup, []);

    return function debouncedCallback(
        ...args: A
    ) {
        // capture latest args
        argsRef.current = args;

        // clear debounce timer
        cleanup();

        // start waiting again
        timeout.current = setTimeout(() => {
            if (argsRef.current) {
                callback(...argsRef.current);
            }
        }, wait);
    };
}

export const useCurrentActiveReportId = (): number | undefined => {

    const [reportId, setReportId] = React.useState<number>();
    const location = useLocation();

    React.useEffect(() => {

        // console.debug('======> useCurrentActiveReportId()', location);
        const matchesReportId = new RegExp(/report\/(\d{1,10})_\d{1,13}/g).exec(location.pathname);

        if (matchesReportId) {

            setReportId(Number(matchesReportId[1]));
        } else {

            setReportId(undefined);
        }
    }, [location.pathname]);

    return reportId;
};

export const useOpenedReports = (): TReport[] => {

    const [reports, setReports] = React.useState<TReport[]>([]);
    const reportsState = RTReport.useTrackedState();

    React.useEffect(() => {

        // console.debug('======> useOpenedReports()', reportsState);
        setReports(
            reportsState
                .filter(reportState => !!reportState.report)
                .map(reportState => reportState.report as TReport)
        );
    }, [reportsState]);

    return reports;
};

export const useReportUrlParameters = (): any => {

    const [parameters, setParameters] = React.useState({});
    const location = useLocation();

    React.useEffect(() => {

        // console.debug('======> useReportUrlParameters()', location);
        if (location.search.length > 0) {

            const searchParams = new URLSearchParams(location.search);
            let tmpParameters: object = {};

            for (const [key, value] of searchParams.entries()) {
                if (key === 'run') {
                    tmpParameters = {...tmpParameters, run: true};
                } else {
                    tmpParameters = {...tmpParameters, [key]: value};
                }
            }

            setParameters({...tmpParameters, key: location.key});
        } else {
            setParameters({})
        }
    }, [location.search, location.key, location]);

    return parameters;
}

export const useUrlParameters = (search: Search, key: LocationKey): any => {

    let parameters: any;

    if (search.length > 0) {

        const searchParams = new URLSearchParams(search);
        let tmpParameters: object = {};

        for (const [key, value] of searchParams.entries()) {
            if (key === 'run') {
                tmpParameters = {...tmpParameters, run: true};
            } else {
                tmpParameters = {...tmpParameters, [key]: value};
            }
        }

        parameters = {...tmpParameters, key: key};
    } else {
        parameters = {};
    }

    return parameters;
}
