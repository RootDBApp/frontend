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

import { EReportDataViewDescriptionDisplayType } from "../../../types/EReportDataViewDescriptionDisplayType";
import OverlayButton                             from "../../common/OverlayButton";
import * as React                                from "react";

export function DataViewTitle(props: { title: string, descriptionDisplayType: number | undefined, replacedDesc: string, id: number }) {
    return <>
        <div className="p-card-title">
            {props.title}
            {props.descriptionDisplayType === EReportDataViewDescriptionDisplayType.OVERLAY && props.replacedDesc && (
                <OverlayButton
                    overlayId={`dataView_${props.id}_description`}
                    overlayContent={<>{props.replacedDesc}</>}
                    className="p-button-rounded p-button-plain p-button-text"
                    icon="pi pi-question-circle"
                    aria-controls={`dataView_${props.id}_description`}
                    aria-haspopup
                />
            )}
        </div>
        <div className="p-card-subtitle">
            {props.descriptionDisplayType === EReportDataViewDescriptionDisplayType.SUBTITLE && props.replacedDesc ? props.replacedDesc : ""}
        </div>
    </>;
}