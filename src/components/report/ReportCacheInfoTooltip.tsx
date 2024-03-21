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

import { Column }         from "primereact/column";
import { DataTable }      from "primereact/datatable";
import React              from "react";
import { useTranslation } from "react-i18next";


import TReportInstance from "../../types/TReportInstance";

const ReportParametersTooltip: React.FC<{ reportInstance: TReportInstance }> = ({reportInstance}) => {

    const {t} = useTranslation(['common']);

    return (
        <DataTable
            value={
                [
                    {
                        key: t('report:cache.cache_type').toString(),
                        value: reportInstance.results_cache_type
                    },
                    {
                        key: t('report:cache.cached_at').toString(),
                        value: `${reportInstance.results_cached_at.getFullYear()}-${reportInstance.results_cached_at.getMonth()}-${reportInstance.results_cached_at.getDay()} ${t('common:at')} ${reportInstance.results_cached_at.getHours()}:${reportInstance.results_cached_at.getMinutes()}`
                    }
                ]
            }
            size="small"
            header={t('report:cache.cache_info')}
            className="no-header"
        >
            <Column field="key"/>
            <Column field="value"/>
        </DataTable>
    );
};

export default ReportParametersTooltip;