import { Button, ButtonProps } from "primereact/button";
import * as React              from 'react';


import { useMobileLayout } from "../../utils/windowResize";

const ButtonDesktopLabel: React.FC<ButtonProps> = (props) => {
    const isMobile = useMobileLayout();

    return <Button
        {...props}
        tooltip={!props.tooltip && isMobile ? props.label : props.tooltip}
        tooltipOptions={{...props.tooltipOptions}}
        label={isMobile ? undefined : props.label}
    />;
};
export default ButtonDesktopLabel;