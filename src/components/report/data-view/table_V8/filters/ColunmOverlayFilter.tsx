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
