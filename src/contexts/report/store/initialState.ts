import TReport         from "../../../types/TReport";
import TReportInstance from "../../../types/TReportInstance";
import { Layout }      from "react-grid-layout";

export interface IReportState {
    instances: Array<TReportInstance>,
    report: TReport | null,
    name: string,
    temporaryLayout?: Layout[],
}

export const initialState: IReportState[] = [];

export const reportInitialState: IReportState = {
    report: null,
    instances: [],
    name: '',
}
export default initialState;