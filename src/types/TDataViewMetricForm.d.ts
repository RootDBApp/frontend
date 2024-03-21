import TDataViewMetricRow from "./TDataViewMetricRow";

type TDataViewMetricForm = {
    rows: TDataViewMetricRow[],
    global?: {
        icon?: string,
        footer?: string,
    }
}

export = TDataViewMetricForm;