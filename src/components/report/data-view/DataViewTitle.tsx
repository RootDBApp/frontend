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