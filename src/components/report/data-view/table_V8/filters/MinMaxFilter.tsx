import { Button }         from "primereact/button";
import { InputNumber }    from "primereact/inputnumber";
import { Nullable }       from "primereact/ts-helpers";
import * as React         from "react";
import { useTranslation } from "react-i18next";

const MinMaxFilter = ({
                          columnId,
                          minMaxDefault = [0, 0],
                          minMaxFilter = [-Infinity, Infinity],
                          activeFilter,
                          setFilter
                      }: {
    columnId: string,
    minMaxDefault?: [number, number],
    minMaxFilter?: [number, number],
    activeFilter: boolean,
    setFilter: Function,
}) => {

    const {t} = useTranslation('common');

    const [min, max] = React.useMemo(() => {
        const [min, max] = minMaxDefault;
        return [Math.floor(min), Math.ceil(max)];
    }, [minMaxDefault]);

    const [selectedMin, selectedMax] = React.useMemo(() => {
        const [min, max] = minMaxFilter;
        return [min, max];
    }, [minMaxFilter]);


    const onChange = (filterMin: Nullable<number>, filterMax: Nullable<number>) => {
        const newMinValue = filterMin !== min ? filterMin : -Infinity;
        const newMaxValue = filterMax !== max ? filterMax : Infinity;

        if (newMinValue === -Infinity && newMaxValue === Infinity) {
            return undefined;
        } else {
            return [newMinValue, newMaxValue];
        }
    };

    return (
        <div className="formgrid grid">
            <div className="field md:col-6 mb-0">
                <div className="flex p-jc-between align-items-center">
                    <label className="p-d-block" htmlFor={`text_filter_${columnId}`}>{t('common:list.min')}</label>
                    <Button
                        icon="pi pi-trash"
                        className={`p-button-rounded p-button-sm p-button-text ${activeFilter && Number(selectedMin) > -Infinity && Number(selectedMin) !== Number(min) ? 'p-button-primary' : 'p-button-plain'}`}
                        type="button"
                        tooltip={t('common:list.reset_filter').toString()}
                        onClick={() => setFilter((old = []) => onChange(min, old[1]))}
                    />
                </div>
                <InputNumber
                    id={`min_filter_${columnId}`}
                    value={selectedMin > -Infinity ? selectedMin : min}
                    onValueChange={(e) => setFilter((old = []) => onChange(e.value, old[1]))}
                    min={min}
                    max={max}
                    mode="decimal"
                    inputClassName="p-inputtext-sm"
                    size={3}
                    step={10}
                    showButtons
                />
            </div>
            <div className="field md:col-6 mb-0">
                <div className="flex p-jc-between align-items-center">
                    <label className="p-d-block" htmlFor={`text_filter_${columnId}`}>{t('common:list.max')}</label>
                    <Button
                        icon="pi pi-trash"
                        className={`p-button-rounded p-button-sm p-button-text ${activeFilter && Number(selectedMax) < Infinity && Number(selectedMax) !== Number(max) ? 'p-button-primary' : 'p-button-plain'}`}
                        type="button"
                        tooltip={t('common:list.reset_filter').toString()}
                        onClick={() => setFilter((old = []) => onChange(old[0], max))}
                    />
                </div>
                <InputNumber
                    id={`max_filter_${columnId}`}
                    value={selectedMax < Infinity ? selectedMax : max}
                    onValueChange={(e) => setFilter((old = []) => onChange(old[0], e.value))}
                    min={min}
                    max={max}
                    mode="decimal"
                    inputClassName="p-inputtext-sm"
                    size={3}
                    step={10}
                    showButtons
                />
            </div>
        </div>
    );
};

export default MinMaxFilter;