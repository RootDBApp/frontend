import { Badge }       from "primereact/badge";
import { Button }      from "primereact/button";
import * as React      from 'react';
import { useNavigate } from "react-router-dom";

import INotificationMessage   from "../../../types/applicationEvent/INotificationMessage";
import { TSeverity }          from "../../../types/common/TSeverity";
import { TBadgeSeverityType } from "../../../types/primereact/TBadgeSeverityType";


export const getIcon = (severity: TSeverity) => {

    switch (severity) {
        case "error":
        case "danger":
            return 'pi-times-circle';
        case "info":
            return 'pi-info-circle';
        case "warning":
        case "warn":
            return 'pi-exclamation-triangle';
        case "success":
            return 'pi-check';
    }
};

const getBadgeSeverity = (severity: TSeverity): TBadgeSeverityType => {

    switch (severity) {
        case "error":
        case "danger":
            return "danger";
        case "info":
            return "info";
        case "warn":
            return "warning";
        default:
            return "danger";
    }
};

const Notification: React.FC<{
    notification: INotificationMessage,
    onClose?: CallableFunction,
    onMouseOver?: CallableFunction,
}> = ({
          notification,
          onClose,
          onMouseOver,
      }): React.ReactElement => {

    const navigate = useNavigate();

    return (
        <div
            className={`p-overlay-badge notification-wrapper p-message p-message-${notification.severity}`}
            onMouseOver={() => onMouseOver ? onMouseOver() : null}
        >
            <div className="p-message-wrapper">
                <i className={`p-message-icon pi ${getIcon(notification.severity)} notification-icon`}/>
                <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    {notification.buttonLabel &&
                        <div style={{marginTop: '1rem'}}>
                            {notification.buttonURLInNewTab ?
                                <a className="p-button-link"
                                   href={`${notification.buttonURL}`}
                                   target="_blank"
                                   rel="noreferrer"
                                >
                                    <Button
                                        icon="pi pi-external-link"
                                        type="button"
                                        label={notification.buttonLabel}
                                        className={`p-button-sm p-button-${notification.buttonSeverity}`}
                                        onClick={() => {
                                        }}
                                    />
                                </a>
                                :
                                <Button
                                    type="button"
                                    label={notification.buttonLabel}
                                    className={`p-button-sm p-button-${notification.buttonSeverity}`}
                                    onClick={() => {
                                        navigate(String(notification.buttonURL))
                                    }}
                                />
                            }
                        </div>
                    }
                </div>
                <Button
                    type="button"
                    onClick={() => onClose ? onClose() : null}
                    className={`p-message-close p-link p-button-rounded p-button-text p-button-${notification.severity}`}
                    icon="p-message-close-icon pi pi-times"
                />
            </div>
            {notification.new && (
                <Badge severity={getBadgeSeverity(notification.severity)}/>
            )}
        </div>
    );
}
export default Notification;