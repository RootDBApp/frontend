import * as React         from 'react';
import { useTranslation } from "react-i18next";

const CenteredNoData: React.FC = () => {

    const {t} = useTranslation('report');

    return (
        <div className="centered-no-data">
                <i className="pi pi-ban"/>
                <span>{t('report:dataview.no_data')}</span>
        </div>
    );
};

export default CenteredNoData;
