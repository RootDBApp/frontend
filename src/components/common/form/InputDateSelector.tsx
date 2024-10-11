import * as React      from 'react';
import { ButtonGroup } from "primereact/buttongroup";
import { Button }      from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import { Calendar }    from "primereact/calendar";

const InputDateSelector = ({value, options, setValueCallBack}: { value: string, options: any[], setValueCallBack: CallableFunction }): JSX.Element => {
    const subMenuItems = React.useMemo(() => options
            .filter(option => option.subMenu === true)
            .map(option => ({
                label: option.label,
                id: option.id,
                command: () => setValueCallBack(option.value)
            })),
        [options, setValueCallBack]);

    const buttons = React.useMemo(() => options.filter(option => !option.subMenu), [options]);

    return (
        <div className="input-date-selector">

            <Calendar value={new Date(value)} showIcon selectionMode="single" />
            <div className="p-button-group p-selectbutton">
                {buttons.map((option, index) => {
                    if (index === buttons.length - 1 && subMenuItems.length > 0) {
                        return (
                            <SplitButton
                                key={option.id}
                                label={option.label}
                                className={`p-selectbutton ${option.value === value ? 'p-highlight' : ''}`}
                                onClick={() => setValueCallBack(option.value)}
                                model={subMenuItems}
                            />
                        )
                    } else {
                        return (
                            <Button
                                key={option.id}
                                label={option.label}
                                className={`p-selectbutton ${option.value === value ? 'p-highlight' : ''}`}
                                onClick={() => setValueCallBack(option.value)}
                            />
                        )
                    }
                })}
            </div>
        </div>
    );
};

export default InputDateSelector;