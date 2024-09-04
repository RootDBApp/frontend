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

import { TFunction }   from "i18next";
import { Outlet, RouteObject } from "react-router-dom";
import * as React      from "react";

import TDialogTitle       from "../types/TDialogTitle";
import ReportCreateWizard from "../components/report/ReportCreateWizard";
import ParametersSetsInCache from "../components/report/report-Parameters/ParametersSetsInCache";


const ReportRouteForms = React.lazy(() => import('../components/report/ReportRouteForms'));
const Settings = React.lazy(() => import('../components/settings/Settings'));
const ReportParameters = React.lazy(() => import('../components/report/ReportParameters'));

export const dialogTitleFromPathNames = (t: TFunction): Array<TDialogTitle> => [
    {pathname: '/create-report-data-view', title: t('report:form.data_view_configuration')},
    {pathname: '/create-report', title: t('report:form.report_configuration')},
    {pathname: '/report-configuration/cache-jobs-configuration', title: t('report:form.report_cache_jobs_configuration')},
    {pathname: '/report-configuration/configuration-data-view', title: t('report:form.data_view_configuration')},
    {pathname: '/report-configuration/edit-data-view-js-init-code', title: t('report:dataview.edit_init_js_code')},
    {pathname: '/report-configuration/input-parameters-configuration', title: t('report:form.report_input_parameters_configuration')},
    {pathname: '/report-configuration', title: t('report:form.data_view_configuration')},
    {pathname: '/report-run/with-input-parameters', title: t('report:input_parameters')},
    {pathname: '/settings/admin/categories', title: t('settings:menu.categories_administration')},
    {pathname: '/settings/admin/connectors', title: t('settings:menu.connector_administration')},
    {pathname: '/settings/admin/directories', title: t('settings:menu.directories_administration')},
    {pathname: '/settings/admin/organizations', title: t('settings:menu.organizations_adminstration')},
    {pathname: '/settings/admin/service-message', title: t('settings:service_message.service_message')},
    {pathname: '/settings/admin/system-metric', title: t('settings:system_info.system_info')},
    {pathname: '/settings/admin/users', title: t('settings:menu.users_administration')},
    {pathname: '/settings/user-preferences', title: t('settings:menu.preferences')},
    {pathname: '/settings/user-profile', title: t('settings:menu.profile')},
    {pathname: '/settings/admin', title: t('settings:menu.administration')},
];

export const globalDialogRoutes: RouteObject[] = [
    {
        path: '/create-report/:directoryId?',
        element: <ReportCreateWizard/>
    },
    {
        path: '/report-configuration/edit-data-view-js-init-code/:configurationReportId/:editInitJsCodeReportDataViewId',
        element: <ReportRouteForms/>,
    },
    {
        path: '/report-configuration/configuration-data-view/:configurationReportId/:configurationReportDataViewId',
        element: <ReportRouteForms/>,
    },
    {
        path: '/report-configuration/input-parameters-configuration/:configurationReportIdForInputParameters',
        element: <ReportRouteForms/>,
    },
    {
        path: '/report-configuration/cache-jobs-configuration/:configurationReportIdForCacheJobs',
        element: <ReportRouteForms/>,
    },
    {
        path: '/report-configuration/:configurationReportId',
        element: <ReportRouteForms/>,
    },
    {
        path: '/report-run/with-input-parameters/:reportId/:reportInstanceId',
        element: <ReportParameters/>,
    },
    // {
    //     path: '/report-run/from-cache/:reportId/:reportInstanceId',
    //     element: <ParametersSetsInCache />,
    // },
    {
        path: '/settings/*',
        element: <Settings/>,
    },
    {
        path: '*',
        element: <Outlet />,
    }
]