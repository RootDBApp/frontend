import { EDataViewMetricFontWeight } from "./EDataViewMetricFontWeight";
import { EDataViewMetricFontSize }   from "./EDataViewMetricFontSize";

type TDataViewMetricRow = {
    id: string,
    text?: string,
    color?: string,
    fontWeight?: EDataViewMetricFontWeight,
    italic?: boolean,
    fontSize?: EDataViewMetricFontSize,
}

export = TDataViewMetricRow;