import { TNameValue }          from "../types/TNameValue";
import TReportParameter        from "../types/TReportParameter";
import { getPlaceholderValue } from "./report";
import TSQLResultColumn        from "../types/TSQLResultColumn";

export const replaceParametersPlaceholders = (text: string, reportParameterInputValues: TNameValue[], reportParameters: TReportParameter[]): string => {

    if (reportParameterInputValues.length === 0 || reportParameters.length === 0) {

        return text;
    }

    const regexp = /\[(\w+)\]/g;
    const placeholders = [...text.matchAll(regexp)].map(m => m[1]);
    let newText = text;

    placeholders.forEach(p => {
        const value = getPlaceholderValue(p, reportParameterInputValues, reportParameters);
        newText = newText.replace(`[${p}]`, value);
    });

    return newText;
}

export const replaceColumnsPlaceholders = (text: string, columns: TSQLResultColumn[]): string => {

    if (columns.length === 0 || columns.length === 0) {

        return text;
    }

    const regexp = /\{(\w+)\}/g;
    const placeholders = [...text.matchAll(regexp)].map(m => m[1]);
    let newText = text;

    placeholders.forEach(p => {
        const value = columns.find(c => c.name === p)?.value;
        newText = newText.replace(`{${p}}`, value);
    });

    return newText;
}

export const wrapPlaceholdersWithSpan = (text: string) => {
    const regexp = /(\[\w+\])|(\{\w+\})/g;
    const placeholders = [...text.matchAll(regexp)].map(m => m[0]);

    let newText = text;

    placeholders.forEach(p => {
        newText = newText.replace(`${p}`, `<span>${p}</span>`);
    });

    return newText;
}