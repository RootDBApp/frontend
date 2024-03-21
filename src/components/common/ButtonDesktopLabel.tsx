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
import * as React              from 'react';


import { useMobileLayout } from "../../utils/windowResize";

const ButtonDesktopLabel: React.FC<ButtonProps> = (props) => {
    const isMobile = useMobileLayout();

    return <Button
        {...props}
        tooltip={!props.tooltip && isMobile ? props.label : props.tooltip}
        tooltipOptions={{...props.tooltipOptions}}
        label={isMobile ? undefined : props.label}
    />;
};
export default ButtonDesktopLabel;