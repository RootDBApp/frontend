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

import { Button }   from "primereact/button";
import { Menu }     from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import * as React   from 'react';
import { TIconPos } from "../../../types/primereact/TIconPos";

const DropDownMenu: React.FC<{
    id: string,
    label: string,
    items: MenuItem[],
    icon?: string,
    iconPos?: TIconPos,
    className?: string
}> = ({
          id,
          label,
          icon,
          iconPos = 'left',
          items,
          className = 'p-button-secondary',
      }) => {
    const menuRef = React.useRef<Menu>(null);
    return (
        <>
            <Button
                type="button"
                id={`${id}-button`}
                label={label}
                icon={icon}
                iconPos={iconPos}
                onClick={
                    (event) => menuRef?.current?.toggle(event)}
                aria-haspopup
                aria-controls={id}
                className={`p-button-text p-p-1 ${className}`}
            />

            <Menu
                model={items}
                popup
                ref={menuRef}
                id={id}
                className="menu"
            />
        </>
    );
};

export default DropDownMenu;