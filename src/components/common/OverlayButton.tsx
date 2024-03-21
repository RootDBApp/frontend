/*
 * This file is part of RootDB.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * AUTHORS
 * PORQUET Sébastien <sebastien.porquet@ijaz.fr>
 * ROBIN Brice <brice@robri.net>
 */

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