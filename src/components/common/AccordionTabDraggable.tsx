import * as React                          from "react";
import { AccordionTab, AccordionTabProps } from "primereact/accordion";
import { ReactNode }                       from "react";

const AccordionTabDraggable: React.FC<AccordionTabProps> = (props): React.ReactElement => {

    React.useEffect(() => {
        console.log('=================================================================');
        console.log('=== AccordionTabProps', props);
    },[props]);

    return <AccordionTab {...props}/>;
}

export default AccordionTabDraggable;