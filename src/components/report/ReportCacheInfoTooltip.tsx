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