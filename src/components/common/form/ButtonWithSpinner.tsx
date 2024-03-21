import { Button, ButtonProps } from "primereact/button";
import { MenuItem }            from "primereact/menuitem";
import * as React              from "react";
import { useTranslation }      from "react-i18next";


export enum SubmitButtonStatus {
    NotValidated,
    ToValidate,
    Validated,
    Validating,
}

type SubmitButtonLabels = {
    default?: string,
    notValidated?: string
    validated?: string,
    validating?: string,
}

const SpinnerLabel: React.FC<{
    buttonStatus: SubmitButtonStatus,
}> = ({
          buttonStatus,
      }): React.ReactElement => {

    return (
        <>
            {buttonStatus === SubmitButtonStatus.Validating &&
                <i className="pi pi-spin pi-spinner" style={{fontSize: '1.2em', marginLeft: '1rem'}}/>
            }
        </>
    );
}

const ButtonWithSpinner: React.FC<{
    buttonStatus: SubmitButtonStatus,
    disabled?: boolean,
    asMenuItem?: boolean,
    doNotAutomaticallyReinitializeLabel?: boolean,
    labels?: SubmitButtonLabels,
    menuItem?: MenuItem,
    menuOptions?: any,
    onClick?: CallableFunction
    severity?: string,
    validateAction?: boolean,
    validateActionCallback?: CallableFunction,
} & ButtonProps> = (
    {
        buttonStatus,
        disabled = false,
        asMenuItem = false,
        doNotAutomaticallyReinitializeLabel = false,
        labels,
        menuItem,
        menuOptions,
        onClick,
        type,
        validateAction,
        validateActionCallback,
        ...props
    }): React.ReactElement => {


    const {t} = useTranslation(['common', 'report']);

    const [confirmationAsked, setConfirmationAsked] = React.useState<boolean>(false);
    const [severity, setSeverity] = React.useState<string>(props?.severity || 'primary');
    const [validateTimeoutHandle, setValidateTimeoutHandle] = React.useState<NodeJS.Timeout>();
    const [label, setLabel] = React.useState<string>(
        (labels?.default) ? labels.default : t('common:form.validate').toString()
    );

    const clickHandler = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {

        if (validateAction) {
            handleOnClick(event)
        }

        // onClick from parent component.
        if (!!onClick) {

            onClick(event as React.MouseEvent<HTMLButtonElement>);
        }
    }

    const handleOnClick = (event: React.MouseEvent): void => {

        if (validateAction && confirmationAsked) {

            if (validateActionCallback) {

                validateActionCallback();
            } else {

                console.warn('No validateActionCallback props defined.');
            }
        }

        setSeverity('warning');
        setLabel(t('common:form.click_to_confirm').toString());
        setConfirmationAsked(true);
        event.preventDefault();

        reinitializeButton();
    }

    const reinitializeButton = (): void => {

        setValidateTimeoutHandle(
            setTimeout(() => {

                setSeverity(props?.severity || 'primary')
                setLabel(
                    (labels?.default) ? labels.default : t('common:form.validate').toString()
                );

                setConfirmationAsked(false);

            }, 2000)
        );
    }

    React.useEffect(() => {

        return () => {
            clearTimeout(Number(validateTimeoutHandle));
        };
    }, [validateTimeoutHandle]);


    React.useEffect(() => {

        switch (buttonStatus) {

            case SubmitButtonStatus.NotValidated: {

                setSeverity('danger');
                setLabel(
                    (labels?.notValidated) ? labels.notValidated : t('common:form.not_validated').toString()
                );
                break;
            }

            case SubmitButtonStatus.ToValidate: {

                setLabel(
                    (labels?.default) ? labels.default : t('common:form.validate').toString()
                );
                break;
            }

            case SubmitButtonStatus.Validating: {

                setLabel(
                    (labels?.validating) ? labels.validating : t('common:form.validating').toString()
                );
                break;
            }

            case SubmitButtonStatus.Validated: {

                setSeverity('success');
                setLabel(
                    (labels?.validated) ? labels.validated : t('common:form.validated').toString()
                );
                break;
            }
        }

        return () => {

            if (!doNotAutomaticallyReinitializeLabel) {

                reinitializeButton();
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buttonStatus]);


    return (
        <>
            {!asMenuItem ? (
                <Button
                    type={type}
                    className={`p-button-${severity} ${props.className}`}
                    disabled={buttonStatus === SubmitButtonStatus.Validating || disabled}
                    label={label}
                    onClick={(event) => clickHandler(event)}
                >
                    <SpinnerLabel buttonStatus={buttonStatus}/>
                </Button>
            ) : (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                    href="#"
                    style={{width: '100%'}}
                    className={`${menuOptions.className} p-button-link`}
                    role="menuitem"
                    onClick={(event) => clickHandler(event)}
                >
                    <span className={`${menuOptions.iconClassName} text-${severity}`}/>
                    <span className={`${menuOptions.labelClassName} text-${severity}`}>{label}</span>
                </a>
            )}
        </>
    );
}

export default ButtonWithSpinner;