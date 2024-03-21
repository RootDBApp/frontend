import { Button } from "primereact/button";
import * as React from 'react';

const DataViewTableCollapsableCell: React.FC<{
    value: string,
    showCollapsibleContentInOverLayPanel: Function
}> = ({
          value,
          showCollapsibleContentInOverLayPanel
      }): React.ReactElement => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [isEllipseApplied, setIsEllipseApplied] = React.useState(false);

    React.useEffect(() => {
        // console.debug('contentRef', contentRef)
        // if (contentRef.current && contentRef.current.offsetWidth < contentRef.current.scrollWidth) {
        if (contentRef.current && contentRef.current.scrollWidth > 150) {
            setIsEllipseApplied(true);
        } else {
            setIsEllipseApplied(false);
        }
    }, [contentRef]);

    return (
        <div className="collapsible-content">
            {isEllipseApplied && (
                <Button
                    type="button"
                    icon='pi pi-search'
                    className="p-button-rounded p-button-text p-button-plain"
                    onClick={(e) => showCollapsibleContentInOverLayPanel(e, value)}
                />
            )}
            <div ref={contentRef} className="content">{value}</div>
        </div>
    )
}

export default DataViewTableCollapsableCell;