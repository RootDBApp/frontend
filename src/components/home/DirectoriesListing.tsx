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

import { Badge }                                             from "primereact/badge";
import { Button }                                            from "primereact/button";
import { Tooltip }                                           from "primereact/tooltip";
import { Tree, TreeEventNodeEvent, TreeNodeTemplateOptions } from "primereact/tree";
import * as React                                            from 'react';
import { useTranslation }                                    from "react-i18next";
import { useNavigate }                                       from "react-router-dom";

import ReportListing                  from "./ReportListing";
import apiDataContext                 from "../../contexts/api_data/store/context";
import { FAVORITES_DIRECTORY_ID }     from "../../utils/definitions";
import TDirectoryTreeNode             from "../../types/TDirectoryTreeNode";
import { useMobileLayout }            from "../../utils/windowResize";
import TreeSelectDirectory            from "../common/form/TreeSelectDirectory";
import { context as authContext }     from "../../contexts/auth/store/context";
import { isThereConnectorConfigured } from "../../utils/tools";
import { EDisplay }                   from "../../types/EDisplay";
import ServiceMessages                from "./ServiceMessages";
import { apiSendRequest }             from "../../services/api";
import { EAPIEndPoint }               from "../../types/EAPIEndPoint";
import { testDevUserExists }          from "../../contexts/auth/store/actions";
import env                            from "../../envVariables";
import HelpButton                     from "../help/HelpButton";
import ButtonDesktopLabel             from "../common/ButtonDesktopLabel";


const findInTreeByKey = (tree: TDirectoryTreeNode[], key: string): TDirectoryTreeNode | null => {

    for (let leaf of tree) {

        if (leaf.key === key) return leaf;

        if (leaf.children) {

            let child = findInTreeByKey(leaf.children, key)
            if (child) return child;
        }
    }
    return null;
}

const nodeTemplate = (node: TDirectoryTreeNode, options: TreeNodeTemplateOptions) => {

    const reportCount = (node.reportCount || 0) + (node.childrenReportCount || 0);

    return (
        <span className={`${options.className} flex-grow-1 flex align-items-center justify-content-between`}>
        {node.label}
            {reportCount > 0 && (
                <Badge value={reportCount} severity="info" className="p-mr-2"/>
            )}
    </span>
    );
}

const DirectoriesListing: React.FC = (): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);
    const navigate = useNavigate();
    const isMobile = useMobileLayout();
    const {state: apiDataState} = React.useContext(apiDataContext);
    const {state: authState, mDispatch: authStateDispatch} = React.useContext(authContext);

    const [currentDirectoryID, setCurrentDirectoryId] = React.useState<number>(-1);
    const [directories, setDirectories] = React.useState<Array<TDirectoryTreeNode>>([]);
    const [displayedDirectories, setDisplayedDirectories] = React.useState<Array<TDirectoryTreeNode>>([]);
    const [showTree, setShowTree] = React.useState<boolean>(true);
    const [showDirectories, setShowDirectories] = React.useState<EDisplay>(EDisplay.DO_NOTHING);
    const [showDevAdminWarning, setShowDevAdminWarning] = React.useState<EDisplay>(EDisplay.DO_NOTHING);
    const [showSuperAdminWarning, setShowSuperAdminWarning] = React.useState<EDisplay>(EDisplay.DO_NOTHING);

    const onSelect = (event: TreeEventNodeEvent) => {

        setCurrentDirectoryId(Number(event.node.key));
    }

    const onExpand = (event: TreeEventNodeEvent) => {

        event.node.icon = 'pi pi-fw pi-folder-open';
    }

    const onCollapse = (event: TreeEventNodeEvent) => {

        event.node.icon = 'pi pi-fw pi-folder';
    }

    // Used to ?
    //
    React.useEffect(() => {

        setDirectories([
            {
                key: "-1",
                label: t('common:list.all').toString(),
                data: 0,
                children: [],
                selectable: true
            },
            ...apiDataState.directoriesTree,
        ]);
    }, [apiDataState.directoriesTree, t]);

    // if we didn't select any directory,
    // select the favorites if there are some favorites reports
    //
    React.useEffect(() => {
        if (currentDirectoryID === -1) {

            const favorites = directories.find(d => d.key === FAVORITES_DIRECTORY_ID);

            if (favorites && Number(favorites.data) > 0) {

                setCurrentDirectoryId(FAVORITES_DIRECTORY_ID);
            }
        }
    }, [directories, currentDirectoryID]);

    // Used to ?
    //
    React.useEffect(() => {

        if (currentDirectoryID === -1) {

            setDisplayedDirectories(directories);
        } else {

            const selectedDirectory = findInTreeByKey(directories, String(currentDirectoryID));

            setDisplayedDirectories(selectedDirectory ? [selectedDirectory] : [])
        }
    }, [directories, currentDirectoryID]);

    // Used to display warning about no dev account setup or missing connector.
    //
    React.useEffect(() => {

        if (authState.user.is_super_admin
            || authState.user.organization_user.ui_grants.report.edit) {

            if (authState.user.is_super_admin) {

                setShowSuperAdminWarning(EDisplay.SHOW);
            }

            if (isThereConnectorConfigured(apiDataState.connectors, authState.user.organization_user.organization)) {

                setShowDirectories(EDisplay.SHOW);
            } else {

                setShowDirectories(EDisplay.HIDE);
            }


            if (authState.user.is_super_admin && authState.testDevUserExists) {

                // Test dev user.
                apiSendRequest({
                    method: 'GET',
                    endPoint: EAPIEndPoint.USER,
                    extraUrlPath: 'test-dev-user',
                    urlParameters: [],
                    callbackSuccess: (response: any) => {
                        authStateDispatch(testDevUserExists(false));
                        if (!Boolean(response.exists)) {

                            setShowDevAdminWarning(EDisplay.SHOW);
                        } else {

                            setShowDevAdminWarning(EDisplay.HIDE);
                        }
                    }
                });
            }
        } else {
            // TODO : check if it's the right behaviour
            setShowDirectories(EDisplay.SHOW);
        }
    }, [
        apiDataState.connectors,
        authState.testDevUserExists,
        authState.user.is_super_admin,
        authState.user.organization_user.ui_grants.report.edit,
        authState.user.organization_user.organization,
        authStateDispatch
    ]);

    return (
        <>
            <Tooltip target=".collapsible-directory"
                     content={t('common:collapsible').toString()}
                     position="bottom"
                     showDelay={env.tooltipShowDelay}
                     hideDelay={env.tooltipHideDelay}
            />
            <div id="directories-listing" className={isMobile ? 'mobile' : ''}>
                {!isMobile ? (
                    <div id="directories-tree" className={showTree ? 'show-tree' : 'hide-tree'}>
                        <Button
                            icon={showTree ? 'pi pi-chevron-left' : 'pi pi-chevron-right'}
                            id="directories-tree-toggle"
                            onClick={() => setShowTree(!showTree)}
                            className="p-button-outlined p-button-secondary"
                        />
                        <Tree
                            value={directories}
                            // @ts-ignore - react-18 move
                            nodeTemplate={nodeTemplate}
                            loading={apiDataState.reportsLoading || apiDataState.categoriesLoading || apiDataState.directoriesLoading || apiDataState.directoriesTreeLoading}
                            className="expand-vertically"
                            onExpand={onExpand}
                            onCollapse={onCollapse}
                            onSelect={onSelect}
                            selectionMode="single"
                            filter
                            filterPlaceholder={t('common:search_a_directory').toString()}
                        />
                    </div>
                ) : (
                    <TreeSelectDirectory
                        onChange={(event) => {
                            setCurrentDirectoryId(Number(event.value))
                        }}
                        id="directory_id"
                        value={currentDirectoryID}
                        isInvalid={false}
                        directories={directories}
                    />
                )}
                <div id="directories-content"
                     className={`
                     ${(!authState.user.is_super_admin && showDirectories === EDisplay.SHOW && apiDataState.reports.length === 0) ?
                         'flex flex-column justify-content-center align-items-center'
                         : (showDirectories === EDisplay.HIDE) && 'flex flex-column'
                     }`}
                >
                    <ServiceMessages/>
                    <>
                        {showSuperAdminWarning === EDisplay.SHOW
                            ?
                            <div className="grid grid-nogutter surface-0 text-800">
                                <div
                                    className="col-12 text-center md:text-left flex align-items-center p-2 border-3 border-red-500">
                                    <section>
                                        <div
                                            className="text-5xl text-primary font-bold mb-3">{t('settings:global_administration.connector.you_are_super_admin').toString()}
                                        </div>
                                        <p className="mt-0 mb-4 text-700 line-height-3">
                                            {t('settings:global_administration.connector.super_admin_limitation').toString()}
                                        </p>
                                    </section>
                                </div>
                            </div>
                            :
                            <></>
                        }
                        {showDevAdminWarning === EDisplay.SHOW
                            ?
                            <div className="grid grid-nogutter surface-0 text-800">
                                <div className="col-12 text-center md:text-left flex align-items-center p-2">
                                    <section>
                                        <div
                                            className="text-5xl text-primary font-bold mb-3">{t('settings:global_administration.connector.no_dev').toString()}
                                        </div>
                                        <p className="mt-0 mb-4 text-700 line-height-3">
                                            {t('settings:global_administration.connector.you_should_setup_a_dev_account').toString()}
                                        </p>
                                        <Button
                                            type="button"
                                            label={t('settings:global_administration.connector.users_management').toString()}
                                            className="p-button-outlined"
                                            onClick={() => {
                                                navigate('/settings/admin/users')
                                            }}
                                        />
                                    </section>
                                </div>
                            </div>
                            :
                            <></>
                        }
                    </>
                    {showDirectories === EDisplay.SHOW ?
                        <>
                            {/* Display a create report button when there's no report.*/}
                            {!authState.user.is_super_admin
                            && authState.user.organization_user.ui_grants.report.edit
                            && apiDataState.reports.length === 0
                                ? <ButtonDesktopLabel
                                    className="p-button p-button-secondary p-button-sm"
                                    icon="pi pi-plus"
                                    label={t('report:form.create_report').toString()}
                                    type="button"
                                    tooltipOptions={{position: "left"}}
                                    onClick={() => {
                                        navigate(`/create-report`);
                                    }}
                                />
                                : <>
                                    {displayedDirectories.map(dir => (
                                        <React.Fragment key={dir.key}>
                                            {(Number(dir.key) > 0) && (
                                                <>
                                                    {(currentDirectoryID === -1 || currentDirectoryID === Number(dir.key)) && (
                                                        <>
                                                            <ReportListing directoryTreeNode={dir} key={dir.key}/>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </React.Fragment>
                                    ))}

                                </>
                            }
                        </>
                        :
                        <>
                            {showDirectories === EDisplay.HIDE
                                ?
                                <div className="grid grid-nogutter surface-0 text-800">
                                    <div className="col-12 text-center md:text-left flex align-items-center p-2">
                                        <section>
                                            <div
                                                className="text-5xl text-primary font-bold mb-3">{t('settings:global_administration.connector.no_connector_configured').toString()}</div>
                                            <p className="mt-0 mb-4 text-700 line-height-3">
                                                {t('settings:global_administration.connector.you_should_setup_a_connector').toString()}
                                            </p>
                                            <Button
                                                type="button"
                                                label={t('settings:global_administration.connector.connector_configuration').toString()}
                                                className="p-button-outlined"
                                                onClick={() => {
                                                    navigate('/settings/admin/connectors')
                                                }}
                                            />
                                            <HelpButton helpCardPath="configure-connector" className="ml-2"/>
                                        </section>
                                    </div>
                                </div>
                                :
                                <></>
                            }
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export default DirectoriesListing;
