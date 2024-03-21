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

import { MenuItem } from "primereact/menuitem";
import * as React   from "react";

const MenuItemShortcutTemplate: React.FC<{
    item: MenuItem,
    options: any,
    shortcut: string
}> = ({
          item,
          options,
          shortcut
      }) => (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
        href="#"
        style={{width: '100%'}}
        className={`${options.className} p-button-link `}
        // target={item.target}
        onClick={options.onClick}
    >
        <span className={options.iconClassName}/>
        <span className={options.labelClassName}>{item.label}</span>
        <span className={`${options.labelClassName} menu-shortcut p-text-right`}>{shortcut}</span>
    </a>
)

export default MenuItemShortcutTemplate;