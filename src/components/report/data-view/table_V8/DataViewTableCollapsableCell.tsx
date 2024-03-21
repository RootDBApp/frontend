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