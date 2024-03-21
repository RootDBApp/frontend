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