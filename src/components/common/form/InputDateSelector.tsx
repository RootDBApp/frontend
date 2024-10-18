import * as React      from 'react';
import { Button }      from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import { Nullable }    from "primereact/ts-helpers";
import { type }        from "node:os";

const InputDateSelectorButtons = (
    {
        value,
        options = [],
        onChange,
    }: {
        value: Nullable<Date>,
        options?: any[],
        onChange: CallableFunction,
    }
): JSX.Element => {
    const inSubMenuItems = React.useMemo(() => options
            .filter(option => option.inSubMenu === true)
            .map(option => ({
                label: option.label,
                id: option.id,
                command: () => onChange(option.value)
            })),
        [options, onChange]);

    const buttons = React.useMemo(() => options.filter(option => !option.inSubMenu), [options]);

    return (
        <div className="p-button-group p-selectbutton">
            {buttons.map((option, index) => {
                if (index === buttons.length - 1 && inSubMenuItems.length > 0) {
                    return (
                        <SplitButton
                            key={option.id}
                            label={option.label}
                            className={`p-selectbutton ${option.value === value ? 'p-highlight' : ''}`}
                            onClick={() => onChange(option.value)}
                            model={inSubMenuItems}
                        />
                    )
                } else {
                    return (
                        <Button
                            type="button"
                            key={option.id}
                            label={option.label}
                            className={`p-selectbutton ${option.value === value ? 'p-highlight' : ''}`}
                            onClick={() => onChange(option.value)}
                        />
                    )
                }
            })}
        </div>
    );
}

const InputDateSelector = ({value, options, onChange}: { value: Nullable<Date>, options: any[], onChange: CallableFunction }): JSX.Element[] => {
    const grouped = Object.groupBy(options, ({group}) => group);
    return Object.values(grouped).map(group => <InputDateSelectorButtons value={value} options={group} onChange={onChange}/>);
};

export default InputDateSelector;