import { Button }         from "primereact/button";
import { OverlayPanel }   from "primereact/overlaypanel";
import * as React         from "react";
import { useTranslation } from "react-i18next";

const ColumnOverlayFilter: React.FC<{
    overlayId: string,
    activeFilter?: boolean,
    children: React.ReactNode,
}> = ({
          overlayId,
          children,
          activeFilter = false,
      }): React.ReactElement => {

    const {t} = useTranslation('common');
    const overlayPanelRef = React.useRef<OverlayPanel>(null);

    return (
        <>
            <Button
                icon="pi pi-filter"
                className={`p-button-rounded p-button-text p-0 p-button-xs ${activeFilter ? 'p-button-primary' : 'p-button-plain'}`}
                type="button"
                aria-controls={overlayId}
                aria-haspopup
                tooltip={t('common:list.filter').toString()}
                tooltipOptions={{position: 'left'}}
                onClick={(event) => overlayPanelRef?.current?.toggle(event, event.target)}
            />
            <OverlayPanel
                ref={overlayPanelRef}
                id={overlayId}
                className=""
                appendTo={document.body}
            >
                {children}
            </OverlayPanel>
        </>
    );
};

export default ColumnOverlayFilter;
