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

import i18n               from "i18next";
import { Dropdown }       from "primereact/dropdown";
import * as React         from "react";
import { useTranslation } from 'react-i18next';

import { apiSendRequest }           from "../../services/api";
import { EAPIEndPoint }             from "../../types/EAPIEndPoint";
import { notificationEvent }        from "../../utils/events";
import { userUpdated }              from "../../contexts/auth/store/actions";
import TUser                        from "../../types/TUser";
import { EReportDevBarMessageType } from "../../types/applicationEvent/EReportDevBarMessageType";
import { context as authContext }   from "../../contexts/auth/store/context";
import env                          from "../../envVariables";
import TRole                        from "../../types/TRole";

const UserPreferences = (): React.ReactElement => {

    const {state: authState, mDispatch: authStateDispatch} = React.useContext(authContext);

    const {t} = useTranslation('settings');
    const [lang, setLang] = React.useState<string>('');
    const [theme, setTheme] = React.useState<string>('');

    React.useEffect(() => {

        if (authState.user.id > 0
            && lang !== '' && theme !== ''
            && (lang !== authState.user.organization_user.user_preferences.lang || theme !== authState.user.organization_user.user_preferences.theme)) {

            if ((env.REACT_APP_DEMO && env.REACT_APP_DEMO === 1)
                && authState.user.organization_user.roles.some((role: TRole) => role.id === 4)
            ) {

                let updatedUser: TUser = authState.user;
                updatedUser.organization_user.user_preferences.lang = lang;
                updatedUser.organization_user.user_preferences.theme = theme;
                authStateDispatch(userUpdated(updatedUser));
                i18n.changeLanguage(String(lang)).then(() => {
                    localStorage.setItem('lang', lang);
                });

            } else {

                apiSendRequest({
                    method: 'PUT',
                    endPoint: EAPIEndPoint.USER_PREFERENCES,
                    resourceId: authState.user.organization_user.user_preferences.id,
                    formValues: {
                        lang: lang,
                        theme: theme
                    },
                    callbackSuccess: () => {

                        let updatedUser: TUser = authState.user;
                        updatedUser.organization_user.user_preferences.lang = lang;
                        updatedUser.organization_user.user_preferences.theme = theme;
                        authStateDispatch(userUpdated(updatedUser));
                        i18n.changeLanguage(String(lang)).then(() => {
                            localStorage.setItem('lang', lang);
                        });

                        document.dispatchEvent(
                            notificationEvent({
                                message: '',
                                reportId: 0,
                                timestamp: Date.now(),
                                title: t('settings:user_preferences.user_preferences_saved').toString(),
                                forceInNotificationCenter: true,
                                type: EReportDevBarMessageType.ERROR,
                                severity: "success",
                                toast: true,
                            })
                        );
                    },
                    callbackError: () => {

                        notificationEvent({
                            message: t('').toString(),
                            reportId: 0,
                            timestamp: Date.now(),
                            title: t('settings:user_preferences.unable_to_save_user_preferences').toString(),
                            forceInNotificationCenter: true,
                            type: EReportDevBarMessageType.ERROR,
                            severity: "success",
                            toast: true,
                        })
                    }
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lang, theme, t]);

    React.useEffect(() => {

        if (authState.user.id > 0) {

            setLang(authState.user.organization_user.user_preferences.lang);
            setTheme(authState.user.organization_user.user_preferences.theme);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authState.user.id]);

    return (
        <div className="grid tab-content">
            <div className="col">
                <form>
                    <div className="formgrid grid">

                        <div className="field col-12 md:col-6">
                            <label htmlFor="theme">{t('interface_preferences.theme.label')}</label>
                            <Dropdown
                                id="user_preferences_theme"
                                name="user_preferences_theme"
                                value={theme}
                                options={[
                                    {label: 'Arya blue', value: 'arya-blue'},
                                    {label: 'Arya green', value: 'arya-green'},
                                    {label: 'Arya orange', value: 'arya-orange'},
                                    {label: 'Arya purple', value: 'arya-purple'},
                                    {label: 'Bootstrap4 dark blue', value: 'bootstrap4-dark-blue'},
                                    {label: 'Bootstrap4 dark purple', value: 'bootstrap4-dark-purple'},
                                    {label: 'Bootstrap4 light blue', value: 'bootstrap4-light-blue'},
                                    {label: 'Bootstrap4 light purple', value: 'bootstrap4-light-purple'},
                                    {label: 'Fluent light', value: 'fluent-light'},
                                    {label: 'Lara dark blue', value: 'lara-dark-blue'},
                                    {label: 'Lara dark indigo', value: 'lara-dark-indigo'},
                                    {label: 'Lara dark purple', value: 'lara-dark-purple'},
                                    {label: 'Lara dark teal', value: 'lara-dark-teal'},
                                    {label: 'Lara light blue', value: 'lara-light-blue'},
                                    {label: 'Lara light indigo', value: 'lara-light-indigo'},
                                    {label: 'Lara light purple', value: 'lara-light-purple'},
                                    {label: 'Lara light teal', value: 'lara-light-teal'},
                                    {label: 'Luna amber', value: 'luna-amber'},
                                    {label: 'Luna blue', value: 'luna-blue'},
                                    {label: 'Luna green', value: 'luna-green'},
                                    {label: 'Luna pink', value: 'luna-pink'},
                                    {label: 'MD dark deeppurple', value: 'md-dark-deeppurple'},
                                    {label: 'MD dark indigo', value: 'md-dark-indigo'},
                                    {label: 'MD light deeppurple', value: 'md-light-deeppurple'},
                                    {label: 'MD light indigo', value: 'md-light-indigo'},
                                    {label: 'MD dark deeppurple', value: 'mdc-dark-deeppurple'},
                                    {label: 'MDC dark indigo', value: 'mdc-dark-indigo'},
                                    {label: 'MDC light deeppurple', value: 'mdc-light-deeppurple'},
                                    {label: 'MDC light indigo', value: 'mdc-light-indigo'},
                                    {label: 'Nova', value: 'nova'},
                                    {label: 'Nova accent', value: 'nova-accent'},
                                    {label: 'Nova alt', value: 'nova_alt'},
                                    {label: 'Rhea', value: 'rhea'},
                                    {label: 'Saga blue', value: 'saga-blue'},
                                    {label: 'Saga green', value: 'saga-green'},
                                    {label: 'Saga orange', value: 'saga-orange'},
                                    {label: 'Saga purple', value: 'saga-purple'},
                                    {label: 'Vela blue', value: 'vela-blue'},
                                    {label: 'Vela green', value: 'vela-green'},
                                    {label: 'Vela orange', value: 'vela-orange'},
                                    {label: 'Vela purple', value: 'vela-purple'},
                                ]}
                                onChange={(event) => {
                                    setTheme(event.value);
                                }}
                                filter
                                scrollHeight="400px"
                                className="w-full"
                            />
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="language">{t('settings:interface_preferences.lang.label')}</label>
                            <Dropdown
                                id="user_preferences_language"
                                name="user_preferences_language"
                                options={[
                                    {label: 'English', value: 'en'},
                                    {label: 'Français', value: 'fr'},
                                ]}
                                value={lang}
                                onChange={(event) => {
                                    setLang(event.value);
                                }}
                                className="w-full"
                            />
                        </div>
                    </div>
                </form>
            </div>

        </div>

    )
};

export default UserPreferences;

