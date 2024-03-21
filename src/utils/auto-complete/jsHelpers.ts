import { TAceCompletion } from "../../types/TAceCompletion";

export const jsHelpers: Array<TAceCompletion> = [
    {
        name: 'jsHelper',
        value: 'rdb.backgroundColors[]',
        score: 100,
        caption: '',
        meta: 'Array<string>'
    },
    {
        name: 'jsHelper',
        value: 'rdb.cjsOnHoverCursor();',
        score: 100,
        caption: '',
        meta: '(event: any, chart: any): void - for chartJS only.'
    },
    {
        name: 'jsHelper',
        value: 'rdb.getReportPathWithParams();',
        score: 100,
        caption: '',
        meta: '(report: number, parameters: Array<TURLParameter>): string'
    },
    {
        name: 'jsHelper',
        value: 'rdb.getTextColor()',
        score: 100,
        caption: '',
        meta: '(): string'
    },
    {
        name: 'jsHelper',
        value: 'rdb.getSurfaceBorder();',
        score: 100,
        caption: '',
        meta: '(): string'
    },
    {
        name: 'jsHelper',
        value: 'rdb.getTextColorSecondary();',
        score: 100,
        caption: '',
        meta: '(): string'
    },
    {
        name: 'jsHelper',
        value: 'rdb.log();',
        score: 100,
        caption: '',
        meta: '(object: any): void'
    },
    {
        name: 'jsHelper',
        value: 'rdb.sortArrayByKeyStringASC();',
        score: 100,
        caption: '',
        meta: '(array: Array<any>, key: string): Array<any>'
    },
];