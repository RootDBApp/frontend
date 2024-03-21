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
import * as React              from "react";
import { useTranslation }      from "react-i18next";
import { useNavigate }         from "react-router-dom";

const HelpButton: React.FC<{
    helpCardPath: string,
    customLabel?: string
} & ButtonProps> = (
    {
        helpCardPath,
        customLabel,
        ...props
    }): React.ReactElement => {

    const {t} = useTranslation('common');
    const navigate = useNavigate();

    return (
        <Button {...props}
                key={`help_button_${helpCardPath}`}
                label={customLabel ? customLabel : t('common:help').toString()}
                icon="pi pi-question"
                onClick={() => {
                    navigate(`/display-help/${helpCardPath}`);
                }}
        />
    )
}

export default HelpButton;