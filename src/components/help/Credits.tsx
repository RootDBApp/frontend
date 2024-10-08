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

import { DataTable }      from "primereact/datatable";
import { Dialog }         from "primereact/dialog";
import { Column }         from "primereact/column";
import { Divider }        from "primereact/divider";
import * as React         from "react";
import { useNavigate }    from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button }         from "primereact/button";

const Credits: React.FC = (): React.ReactElement => {

    const navigate = useNavigate();
    const {t} = useTranslation('common');

    const [projects,] = React.useState([
        {
            'name': 'Apache ECharts',
            'website': <a href="https://echarts.apache.org/" rel="noreferrer" target="_blank"><Button
                label={t('common:link').toString()} link/></a>
        },
        {
            'name': 'Axios',
            'website': <a href="https://axios-http.com/docs/intro" rel="noreferrer" target="_blank"><Button
                label={t('common:link').toString()} link/></a>
        },
        {
            'name': 'Chart.js',
            'website': <a href="https://www.chartjs.org/" rel="noreferrer" target="_blank"><Button
                label={t('common:link').toString()} link/></a>
        },
        {
            'name': 'D3.js',
            'website': <a href="https://d3js.org/" rel="noreferrer" target="_blank"><Button
                label={t('common:link').toString()} link/></a>
        },
        {
            'name': 'Formik',
            'website': <a href="https://formik.org/" rel="noreferrer" target="_blank"><Button
                label={t('common:link').toString()} link/></a>
        },
        {
            'name': 'Laravel',
            'website': <a href="https://laravel.com/" rel="noreferrer" target="_blank"><Button
                label={t('common:link').toString()} link/></a>
        },
        {
            'name': 'Laravel Echo',
            'website': <a href="https://github.com/laravel/echo" rel="noreferrer" target="_blank"><Button
                label={t('common:link').toString()} link/></a>
        },
        {
            'name': 'Laravel Websocket',
            'website': <a href="https://beyondco.de/docs/laravel-websockets/getting-started/introduction"
                          rel="noreferrer" target="_blank"><Button label={t('common:link').toString()} link/></a>
        },
        {
            'name': 'PrimeReact',
            'website': <a href="https://primereact.org/" rel="noreferrer" target="_blank"><Button
                label={t('common:link').toString()} link/></a>
        },
        {
            'name': 'Pusher',
            'website': <a href="https://github.com/pusher/pusher-js" rel="noreferrer" target="_blank"><Button
                label={t('common:link').toString()} link/></a>
        },
        {
            'name': 'React',
            'website': <a href="https://fr.reactjs.org/" rel="noreferrer" target="_blank"><Button
                label={t('common:link').toString()} link/></a>
        },
        {
            'name': 'React ACE',
            'website': <a href="https://github.com/securingsincity/react-ace" rel="noreferrer" target="_blank"><Button
                label={t('common:link').toString()} link/></a>
        },
        {
            'name': 'React Beautiful DND',
            'website': <a href="https://github.com/atlassian/react-beautiful-dnd" rel="noreferrer"
                          target="_blank"><Button label={t('common:link').toString()} link/></a>
        },
        {
            'name': 'React-GridLayout',
            'website': <a href="https://github.com/react-grid-layout/react-grid-layout" rel="noreferrer"
                          target="_blank"><Button label={t('common:link').toString()} link/></a>
        },
        {
            'name': 'React Tracked',
            'website': <a href="https://react-tracked.js.org/" rel="noreferrer" target="_blank"><Button
                label={t('common:link').toString()} link/></a>
        },
        {
            'name': 'Yup',
            'website': <a href="https://github.com/jquense/yup" rel="noreferrer" target="_blank"><Button
                label={t('common:link').toString()} link/></a>
        },
    ]);

    return (
        <Dialog
            visible
            onHide={() => {
                navigate('/home');
            }}
            maximizable
            header={t('menu:credits').toString()}
        >
            <p>{t('help:credits.thanks').toString()}</p>
            <DataTable value={projects}  size="small">
                <Column field="name" header={t('common:project').toString()}></Column>
                <Column field="website" header={t('common:website').toString()}></Column>
            </DataTable>
            <Divider/>

        </Dialog>
    );
}

export default Credits;