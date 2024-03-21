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
import * as React         from 'react';
import { useTranslation } from "react-i18next";
import { ReactNode }      from "react";

const CenteredError: React.FC<{
        extraMessage?: ReactNode,
        actionLabel?: string,
        action?: Function,
    }> = ({
              extraMessage,
              action,
              actionLabel
          }) => {

        const {t} = useTranslation('common');

        return (
            <div className="centered-error">
                <div className="flex flex-row align-items-center justify-content-start">
                    <i className="pi pi-exclamation-triangle"/>
                    <span>{t('common:an_error_occured')}</span>
                </div>
                {extraMessage}
                {action && (
                    <Button
                        type="button"
                        label={actionLabel || 'OK'}
                        onClick={() => action()}
                    />
                )}
            </div>
        );
    }
;

export default CenteredError;
