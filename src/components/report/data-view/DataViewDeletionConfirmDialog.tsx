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