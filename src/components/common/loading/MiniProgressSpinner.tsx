import { ProgressSpinner } from "primereact/progressspinner";
import * as React          from 'react';

const MiniProgressSpinner: React.FC<{
    widthHeightPx?: number
}> = ({widthHeightPx = 25}): React.ReactElement => {

    return <ProgressSpinner
        style={{width: `${widthHeightPx}px`, height: `${widthHeightPx}px`}}
        strokeWidth="5"
        animationDuration=".5s"
    />
};

export default MiniProgressSpinner;
