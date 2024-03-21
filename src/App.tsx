
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
