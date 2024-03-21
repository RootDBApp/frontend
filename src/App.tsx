
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import './scss/main.scss';

import * as PR           from 'primereact/api';
import { ConfirmDialog } from "primereact/confirmdialog";
import * as React        from "react";

import AuthContextProvider                   from "./contexts/auth/AuthContextProvider";
import APIDataContextProvider                from "./contexts/api_data/APIDataContextProvider";
import PreferencesContextProvider            from "./contexts/preferences/PreferencesContextProvider";
import RouteSwitch                           from "./components/routes/RouteSwitch";
import ThemeStyle                            from "./components/header/ThemeStyle";
import { Provider as ReportContextProvider } from "./contexts/report/ReportContextProvider";
import GlobalErrorBoundary                   from "./components/common/GlobalErrorBoundary";
import RouterProvider                        from "./contexts/RouterProvider";
import GlobalDialog                          from "./components/dialog/GlobalDialog";


function App() {

    const i18n_fr = {
        firstDayOfWeek: 1,
        dayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
        dayNamesShort: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
        dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
        monthNames: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
        monthNamesShort: ['jan', 'fev', 'mar', 'avr', 'mai', 'jui', 'juil', 'aou', 'sep', 'oct', 'nov', 'déc'],
        today: 'Aujourd\'hui',
        clear: 'Vider'
    };

    // Primereact localizations.
    PR.addLocale('fr', i18n_fr);
    PR.locale('fr');

    // For chrome based engine.
    PR.addLocale('fr-FR', i18n_fr);
    PR.locale('fr-FR');

    return (
        <>
            <ConfirmDialog/>
            <GlobalErrorBoundary>
                <RouterProvider>
                    {/*@ts-ignore*/}
                    <PreferencesContextProvider>
                        {/*@ts-ignore*/}
                        <AuthContextProvider>
                            {/*@ts-ignore*/}
                            <APIDataContextProvider>
                                <ThemeStyle>

                                    <ReportContextProvider>
                                        <GlobalDialog />

                                        <div className="grid-main">

                                            <RouteSwitch/>

                                        </div>

                                    </ReportContextProvider>

                                </ThemeStyle>
                            </APIDataContextProvider>
                        </AuthContextProvider>
                    </PreferencesContextProvider>
                </RouterProvider>
            </GlobalErrorBoundary>
        </>
    );
}

export default App;
