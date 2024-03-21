import { Button, ButtonProps } from "primereact/button";
import { Dialog }              from "primereact/dialog";
import { OverlayPanel }        from "primereact/overlaypanel";
import { MenuItem }            from "primereact/menuitem";
import { Tooltip }             from "primereact/tooltip";
import * as React              from "react";

import env from "../../envVariables";

const OverlayButton: React.FC<{
    overlayId: string,
    overlayStyle?: object,
    overlayContent: React.ReactElement,
    title?: string,
    asMenuItem?: boolean,
    menuItem?: MenuItem,
    menuOptions?: any,
} & ButtonProps> = (
    {
        overlayId,
        overlayStyle,
        overlayContent,
        title,
        asMenuItem = false,
        menuItem,
        menuOptions,
        ...props
    }): React.ReactElement => {

    const overlayPanelRef = React.useRef<OverlayPanel>(null);
    const [dialogVisible, setDialogVisible] = React.useState(false);

    const toggleVisible = (event: React.MouseEvent | undefined) => {

        if (event) {

            overlayPanelRef?.current?.toggle(event, event?.target);
            setDialogVisible(!dialogVisible);
        } else {

            overlayPanelRef?.current?.hide();
            setDialogVisible(false);
        }
    }

    return (
        <>
            {!asMenuItem ? (
                <Button
                    {...props}
                    type="button"
                    onClick={(event) => toggleVisible(event)}
                />
            ) : (
                <>
                    <Tooltip target={`#${overlayId}-button`}
                             position={"bottom"}
                             content={props.tooltip}
                             showDelay={env.tooltipShowDelay}
                             hideDelay={env.tooltipHideDelay}
                    />
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a style={{width: '100%'}}
                       className={`${menuOptions.className} p-button-link`}
                       onClick={(event) => toggleVisible(event)}
                    >
                        <span id={`${overlayId}-button`} className={menuOptions.iconClassName}/>
                        <span className={menuOptions.labelClassName}>{menuItem?.label}</span>
                    </a>
                </>
            )}
            <OverlayPanel
                onHide={() => toggleVisible(undefined)}
                ref={overlayPanelRef}
                id={overlayId}
                className="overlay-replace-dialog"
                style={overlayStyle}
            >
                {React.cloneElement(overlayContent, {overlayPanelRef})}
            </OverlayPanel>
            <Dialog
                draggable={false}
                dismissableMask
                maskClassName="dialog-replace-overlay"
                header={title}
                visible={dialogVisible}
                onHide={() => toggleVisible(undefined)}
            >
                {overlayContent}
            </Dialog>
        </>
    )
}

export default OverlayButton;