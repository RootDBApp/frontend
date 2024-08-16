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

import { Badge }          from "primereact/badge";
import { Button }         from "primereact/button";
import { Sidebar }        from "primereact/sidebar";
import * as React         from 'react';
import { useNavigate }    from "react-router-dom";
import { useTranslation } from "react-i18next";


import INotificationMessage                               from "../../../types/application-event/INotificationMessage";
import Notification, { getIcon }                          from "./Notification";
import { reportDevBarEvent }                              from "../../../utils/events";
import { context as authContext }                         from "../../../contexts/auth/store/context";
import { Messages }                                       from "primereact/messages";
import { Bounce, Id, toast, ToastContainer, TypeOptions } from "react-toastify";
import { TToastSeverity }                                 from "../../../types/primereact/TToastSeverity";


const getToastSeverity = (severity: TToastSeverity): TypeOptions => {
    // TypeOptions = 'info' | 'success' | 'warning' | 'error' | 'default';
    if (severity === "warn") {
        return "warning";
    }
    if (!severity) return "default";

    return severity;
};

const NotificationCenter: React.FC = (): React.ReactElement => {

    const {t} = useTranslation('common');

    const navigate = useNavigate();
    const {state: authState} = React.useContext(authContext);

    const toastId = React.useRef<Id>();

    const [visible, setVisible] = React.useState(false);
    const [notifications, setNotifications] = React.useState<INotificationMessage[]>([]);
    const [notificationsExist, setNotificationExist] = React.useState(false);
    const [newNotificationsExist, setNewNotificationExist] = React.useState(false);

    const markMessageAsRead = (messageId: number) => {

        setNotifications(prevNotifications => prevNotifications.map(n => (
            n.timestamp === messageId ? {...n, new: false} : n
        )))
    };

    const deleteNotification = (timestamp: number) => {

        setNotifications(prevNotifications => prevNotifications.filter(n => n.timestamp !== timestamp));
    };

    const orderNotification = (a: INotificationMessage, b: INotificationMessage) => b.timestamp - a.timestamp;

    const processNotification = (notification: INotificationMessage) => {

        if (notification.forceInNotificationCenter) {

            setNotifications(prevNotifications => [
                ...prevNotifications,
                {...notification, new: false}
            ]);
        }

        if (notification.toast) {

            const options = {
                type: getToastSeverity(notification.severity),
                autoClose: notification.life ?? 3000,
                className: `notification-wrapper p-message p-message-${notification.severity}`,
                bodyClassName: 'p-message-wrapper',
                icon: <i className={`p-message-icon pi ${getIcon(notification.severity)} notification-icon`}/>
            }

            const content = (
                <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    {notification.buttonLabel && (
                        <div className="mt-3">
                            {notification.buttonURLInNewTab ?
                                <a className="p-button-link"
                                   href={`${notification.buttonURL}`}
                                   target="_blank"
                                   rel="noreferrer"
                                   style={{textDecoration: 'none'}}
                                >
                                    <Button
                                        icon="pi pi-external-link"
                                        type="button"
                                        label={notification.buttonLabel}
                                        className={`p-button-sm p-button-${notification.buttonSeverity}`}
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
                    )}
                </div>

            );
            if (toastId.current && toast.isActive(toastId.current)) {
                toast.update(toastId.current, {
                    ...options,
                    render: content,
                })
            } else {
                toastId.current = toast(content, options);
            }
        }
    }

    React.useEffect(() => {

        const handleNotificationEvent = (
            (event: CustomEvent<INotificationMessage>) => {

                if (authState.user.organization_user.ui_grants.report.edit) {

                    document.dispatchEvent(
                        reportDevBarEvent({
                            reportId: event.detail.reportId,
                            timestamp: event.detail.timestamp,
                            title: event.detail.title,
                            message: event.detail.message,
                            type: event.detail.type,
                        }));

                    if (event.detail.forceInNotificationCenter || event.detail.toast) {

                        processNotification(event.detail);
                    }
                } else {

                    if (!event.detail.forDevBarOnly) {

                        processNotification(event.detail);
                    }
                }
            }
        ) as EventListener;

        document.addEventListener("notificationEvent", handleNotificationEvent);

        return () => {

            document.removeEventListener("notificationEvent", handleNotificationEvent);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authState.user.organization_user.role_ids]);

    React.useEffect(() => {

        setNotificationExist(notifications.length > 0);
        setNewNotificationExist(notifications.filter(n => n.new).length > 0);
    }, [notifications]);

    return (
        <>
            {/* I'm here only to load css styles */}
            <Messages/>
            <Button
                type="button"
                className="p-button-link"
                onClick={() => setVisible(true)}
            >
                <i
                    className={`pi pi-bell p-text-secondary ${newNotificationsExist ? 'p-overlay-badge' : ''}`}
                    style={{fontSize: '1.2rem'}}
                >
                    {newNotificationsExist && (
                        <Badge value={notifications.filter(n => n.new).length} severity="danger"/>
                    )}
                </i>
            </Button>

            <Sidebar visible={visible} position={"right"} onHide={() => setVisible(false)} className="p-sidebar-md">
                <div className="flex align-items-center justify-content-between">
                    <h1 style={{fontWeight: 'normal'}}>{t('common:notifications')}</h1>
                    {notificationsExist && (
                        <Button
                            type="button"
                            onClick={() => setNotifications([])}
                            className="p-button-rounded p-button-text p-button-lg"
                            icon="pi pi-trash"
                            tooltip={t('common:remove_all').toString()}
                            tooltipOptions={{position: "left"}}
                        />
                    )}
                </div>
                {notifications.sort(orderNotification).map(notification => (
                    <Notification
                        notification={{
                            ...notification,
                            severity: notification.severity,
                        }}
                        key={notification.timestamp}
                        onClose={() => deleteNotification(notification.timestamp)}
                        onMouseOver={() => markMessageAsRead(notification.timestamp)}
                    />
                ))}
            </Sidebar>

            <ToastContainer
                position="top-right"
                closeButton={false}
                closeOnClick
                draggable={false}
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
        </>
    )
}
export default NotificationCenter;