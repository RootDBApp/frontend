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

import React                 from "react";
import { TabPanel, TabView } from "primereact/tabview";
import TReportDataViewJs     from "../../../../../types/TReportDataViewJs";

const ChartJsConfiguratorConfig = React.lazy(() => import('./ChartJsConfiguratorConfig'));
const ChartJsConfiguratorConfigDatasets = React.lazy(() => import('./ChartJsConfiguratorConfigDatasets'));
const ChartJsConfiguratorLabels = React.lazy(() => import('./ChartJsConfiguratorLabels'));
const ChartJsConfiguratorActions = React.lazy(() => import('./ChartJsConfiguratorActions'));

const ChartJsConfigurator: React.FC<{
    dataViewJs: TReportDataViewJs
}> = ({
                                     dataViewJs
      }): React.ReactElement => {

    // Initialize chartjs object with existing js code.
    React.useEffect(() => {

    }, []);

    console.debug('----------------------------------------------------------');
    console.debug('dataViewJs ->', dataViewJs);


    return (
        <>
            <TabView>
                <TabPanel header="Config">
                    <ChartJsConfiguratorConfig/>
                </TabPanel>
                <TabPanel header="Setup">
                    <TabView>
                        <TabPanel header="Datasets">
                            <ChartJsConfiguratorConfigDatasets/>
                        </TabPanel>
                        <TabPanel header="Labels">
                            <ChartJsConfiguratorLabels/>
                        </TabPanel>
                    </TabView>
                </TabPanel>
                <TabPanel header="Actions">
                    <ChartJsConfiguratorActions/>
                </TabPanel>
            </TabView>
        </>
    );
}

export default ChartJsConfigurator;