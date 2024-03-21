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

import * as React    from "react";
import { ReactNode } from "react";

import { context as authContext } from "../../contexts/auth/store/context";
import { importTheme }            from "../../services/themes";
import CenteredLoading            from "../common/loading/CenteredLoading";
import Fade                       from "../common/transition/Fade";

const ThemeStyle: React.FC<{ children: ReactNode }> = ({children}): React.ReactElement => {

    const {state: authState} = React.useContext(authContext);
    const [cssStyles, setCssStyles] = React.useState('');
    const [loadedTheme, setLoadedTheme] = React.useState('');
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {

        const theme = (authState.user && authState.user.organization_user.user_preferences.theme)
            ? authState.user.organization_user.user_preferences.theme
            : 'saga-blue';

        if (!cssStyles || loadedTheme !== theme) {
            setLoading(true);

            importTheme(theme,
                (cssStyles) => {
                    setCssStyles(cssStyles);
                    setLoadedTheme(theme);
                    setLoading(false);
                },
                () => {
                    setLoadedTheme('');
                    setLoading(false);
                }
            );
        }

    }, [authState.user, authState.user.organization_user.user_preferences.theme, cssStyles, loadedTheme])

    return (
        <>
            <Fade in={loading}>
                {loading && <CenteredLoading/>}
            </Fade>
            <Fade in={!loading}>
                <style>
                    {cssStyles}
                </style>
                {children}
            </Fade>
        </>
    )
}

export default ThemeStyle;