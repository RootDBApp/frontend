import { TNameValue } from "./TNameValue";

type TReportRunInfo = {
    instanceId: number,
    formValues: Array<TNameValue>
    run: boolean,
    useCache: boolean,
}

export = TReportRunInfo;