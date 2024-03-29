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

import { Dialog }                                           from "primereact/dialog";
import * as React                                           from "react";
import { useTranslation }                                   from "react-i18next";
import { matchRoutes, useLocation, useNavigate, useRoutes } from "react-router-dom";
import { dialogTitleFromPathNames, globalDialogRoutes }     from "../../services/globalDialogService";
import { RouterContext }                                    from "../../contexts/RouterContext";
import TDialogTitle                                         from "../../types/TDialogTitle";
import { context as authContext }                           from "../../contexts/auth/store/context";

const GlobalDialog = () => {
    const [visible, setVisible] = React.useState(false);
    const [maximized, setMaximized] = React.useState(false);
    const [dialogTitle, setDialogTitle] = React.useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const routerContext = React.useContext(RouterContext);
    const routes = useRoutes(globalDialogRoutes);
    const {state: authState} = React.useContext(authContext);
    const {t} = useTranslation();

    React.useEffect(() => {
        const matches = matchRoutes(globalDialogRoutes, location.pathname);

        if (matches && matches.length > 0) {
            const [{route: {path = ''} = {}}] = matches;
            setVisible(path !== "*");
        } else {
            // when url changes from outside the dialog
            setVisible(false);
        }

        setMaximized(
            location.pathname.startsWith('/settings/') && (
                location.pathname !== '/settings/user-preferences'
                && location.pathname !== '/settings/user-profile'
            )
        );
    }, [location.pathname]);

    const redirectUrl = React.useMemo(() => {
        if (routerContext.from !== location.pathname) {
            return routerContext.from;
        }
        return '/home';
    }, [routerContext.from, location.pathname]);

    React.useEffect(() => {

        const dialogTitle = dialogTitleFromPathNames(t).find((dialogTitle: TDialogTitle) => {
            return location.pathname.indexOf(dialogTitle.pathname) >= 0;
        });

        setDialogTitle(dialogTitle === undefined ? '' : dialogTitle.title);
    }, [location.pathname, t])

    return (
        <>
            {authState.isLoggedIn && visible && (
                <Dialog
                    onHide={() => {
                        setVisible(false);
                        navigate(redirectUrl, {replace: true})
                    }}
                    header={`${authState.user.organization_user?.organization.name} | ${dialogTitle}`}
                    draggable={false}
                    visible
                    maximized={maximized}
                    position="top"
                    style={{maxWidth: '1500px'}}
                    id="global-dialog"
                >
                    {routes}
                </Dialog>
            )}
        </>
    );
}

export default GlobalDialog;