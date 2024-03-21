import { t }                                  from "i18next";
import { confirmDialog, ConfirmDialogReturn } from "primereact/confirmdialog";
import { Dispatch }                           from "react";

import { apiSendRequest }                                             from "../../../services/api";
import { EAPIEndPoint }                                               from "../../../types/EAPIEndPoint";
import { deletedReportDataView, reportExpandDataView, TReportAction } from "../../../contexts/report/store/actions";

export const dataviewDeletionConfirmDialog = (
    dataViewId: number,
    dataViewName: string,
    reportId: number,
    reportInstanceId: number,
    reportDispatch: Dispatch<TReportAction>,
): ConfirmDialogReturn => {

    return confirmDialog({
        appendTo: document.body,
        message: t('report:dataview.remove_data_view').toString(),
        header: dataViewName,
        icon: 'pi pi-metric-circle',
        acceptClassName: 'p-button-danger',
        position: 'top',
        acceptLabel: t('common:yes').toString(),
        rejectLabel: t('common:no').toString(),
        accept: () => {

            apiSendRequest({
                method: 'DELETE',
                endPoint: EAPIEndPoint.REPORT_DATA_VIEW,
                resourceId: dataViewId,
                callbackSuccess: () => {

                    reportDispatch(reportExpandDataView({
                        reportId: reportId,
                        reportInstanceId: reportInstanceId,
                        dataViewId: undefined
                    }))
                    reportDispatch(deletedReportDataView({
                        reportId: reportId,
                        dataViewId: dataViewId
                    }))
                },
                callbackError: () => {

                }
            });
        }
    });

}