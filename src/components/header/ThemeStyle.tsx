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