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
