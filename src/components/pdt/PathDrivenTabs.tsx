import { ContextMenu }                                                          from "primereact/contextmenu";
import { MenuItem }                                                             from "primereact/menuitem";
import * as React                                                               from "react";
import { DragDropContext, Draggable, DraggableProvided, Droppable, DropResult } from "react-beautiful-dnd";
import { useTranslation }                                                       from "react-i18next";
import { matchRoutes, useLocation, useMatch, useNavigate }                      from "react-router-dom";

import { context as authContext } from "../../contexts/auth/store/context";
import {
    allTabRouteSettings,
    getPTabRouteComponent,
    tabRouteHelp,
    tabRouteHome
}                                 from "../../services/pathDrivenTabService";
import TPDTabRouteSettings
                                  from "../../types/pdt/TPDTabRouteSettings";
import { IPDTabRoute }            from "../../types/pdt/IPDTabRoute";
import PathDrivenTab              from "./PathDrivenTab";
import MenuItemShortcutTemplate
                                  from "../common/menu/MenuItemShortcutTemplate";
import { EPDTTabType }            from "../../types/EPDTTabType";
import { EDirection }             from "../../types/EDirection";
import {
    extractReportIdFromReportUniqId,
    extractReportInstanceIdFromReportUniqId
}                                 from "../../utils/tools";
import { TabView }                from "primereact/tabview";

const PathDrivenTabs: React.FC<{
    pdtHeaderClassname?: string,
    pdtContentsClassname?: string,
}> = ({
          pdtHeaderClassname = "",
          pdtContentsClassname = ""
      }): React.ReactElement => {

    const {t} = useTranslation(['report']);
    const navigate = useNavigate();
    const location = useLocation();
    const matchCloseTabs = useMatch("/closeTabs");
    const {state: authState} = React.useContext(authContext)

    const [tabs, setTabs] = React.useState<IPDTabRoute[]>([]);
    const [helpTabDisplayed, setHelpTabDisplayed] = React.useState<boolean>(false);

    const contextMenuRef = React.useRef<ContextMenu>(null);
    const [contextualMenuItems, setContextualMenuItems] = React.useState<MenuItem[]>([]);


    // Handle report's shortcuts, to go on left or right tab.
    //
    React.useEffect(() => {

        function handleShortcut(event: KeyboardEvent): void {

            const {
                altKey,
                shiftKey,
                code,
            } = event;

            let direction: EDirection = EDirection.NONE;
            let tabIndexToSwitch: number = 0;

            // ALT + SHIFT + H
            if (code === 'KeyH' && altKey && shiftKey) {

                event.preventDefault();

                direction = EDirection.LEFT;
            } else if (code === 'KeyJ' && altKey && shiftKey) {

                event.preventDefault();

                direction = EDirection.RIGHT;
            }

            if (direction !== EDirection.NONE) {

                const activeIndex: number = tabs.findIndex(tab => tab.tabDisplayed);
                // First tab.
                if (activeIndex === 0) {

                    if (direction === EDirection.LEFT) {
                        tabIndexToSwitch = tabs.length - 1
                    } else {
                        tabIndexToSwitch = tabs.length > 1 ? activeIndex + 1 : 0;
                    }
                }
                // Last tab.
                else if (activeIndex === (tabs.length - 1)) {

                    if (direction === EDirection.LEFT) {
                        tabIndexToSwitch = tabs.length > 1 ? activeIndex - 1 : 0;
                    } else {
                        tabIndexToSwitch = 0;
                    }
                }
                // Tab between first & last tab.
                else {

                    if (direction === EDirection.LEFT) {
                        tabIndexToSwitch = activeIndex - 1;
                    } else {
                        tabIndexToSwitch = activeIndex + 1;
                    }
                }


                if (tabs[tabIndexToSwitch]) {

                    navigate(tabs[tabIndexToSwitch].locationPathname);
                }
            }
        }

        // Bind the Event listener
        document.addEventListener("keydown", handleShortcut);
        return () => {

            // Unbind the event listener on clean up
            document.removeEventListener("keydown", handleShortcut);
        };
    }, [
        tabs,
        navigate
    ]);

    // Display previous tabs, when user logged.
    //
    React.useEffect(() => {
        try {
            const savedTabs = localStorage.getItem('pathDrivenTabs');

            if (savedTabs) {

                const parsedTabs = JSON.parse(savedTabs);
                setTabs(parsedTabs.map((parsedTab: IPDTabRoute) => ({
                    ...parsedTab,
                    component: getPTabRouteComponent(parsedTab),
                })));
            }
        } catch (e) {
        }
    }, []);

    // Display Home tab when organizationId change
    //React.useEffect(() => {
    //
    //    // setTabs(previousTabs => previousTabs.filter(tabRoute => tabRoute.type === defaultTabRouteSettings.type));
    //}, [authState.organizationId]);

    // Should display Home tab when closing all tabs
    //
    React.useEffect(() => {

        if (matchCloseTabs) {

            setTabs(previousTabs => previousTabs.filter(tabRoute => tabRoute.type === tabRouteHome.type));
        }
    }, [matchCloseTabs]);

    // Handle "close" shortcut.
    //
    React.useEffect(() => {

        function handleShortcut(event: KeyboardEvent): void {
            const {
                ctrlKey,
                altKey,
                shiftKey,
                code,
            } = event;

            // Close one tab
            // ALT + SHIFT + W
            if (code === 'KeyZ' && altKey && shiftKey && ctrlKey) {

                event.stopPropagation();

                setTabs([]);
            } else if (code === 'KeyZ' && altKey && shiftKey) {

                event.stopPropagation();

                setTabs(previousTabs => previousTabs.filter(tab => tab.locationPathname !== location.pathname));
            }
        }

        // Bind the event listener
        document.addEventListener("keydown", handleShortcut);
        return () => {

            // Unbind the event listener on clean up
            document.removeEventListener("keydown", handleShortcut);
        };
    }, [location.pathname]);

    // Handle tabs display when there's a change in the URL.
    //
    React.useEffect(() => {

        const matches = matchRoutes(allTabRouteSettings, location.pathname);
        const matchedRoute = matches?.find(match => match.route !== undefined && (match.route as TPDTabRouteSettings).type !== undefined);

        // console.debug('-- [PathDriveTabs] React.useEffect - Handle tabs display when there\'s a change in the URL.');
        // console.debug('-- [PathDriveTabs] matches', matches);
        // console.debug('-- [PathDriveTabs] matchedRoute', matchedRoute);

        if (matchedRoute) {

            const tabId = `tab${matchedRoute.pathnameBase.replace(/\//g, '_')}`;
            const locationPathname = `${location.pathname}${location.search.replace(/[?&]run$/, '')}`;

            // console.debug('-- [PathDriveTabs] tabId', tabId);
            // console.debug('-- [PathDriveTabs] locationPathname', locationPathname);

            setTabs(previousTabs => {

                const existingTab = previousTabs.find(tab => tab.id === tabId);

                // console.debug('-- [PathDriveTabs] existingTab', existingTab);

                if (existingTab) {

                    return previousTabs.map(tab => {

                        if (tab.id === existingTab.id) {

                            return {
                                ...tab,
                                tabDisplayed: true,
                                locationPathname,
                                previousLocationPathname: tab.locationPathname,
                            };
                        } else {

                            return {
                                ...tab,
                                tabDisplayed: false,
                            }
                        }
                    })
                } else {

                    let reportUniqId = (matchedRoute.route as TPDTabRouteSettings).type === Number(EPDTTabType.REPORT)
                        ? matchedRoute.params.reportId
                        : undefined;

                    let reportId = 0;
                    let reportInstanceId = 0;
                    if (reportUniqId) {

                        reportId = extractReportIdFromReportUniqId(reportUniqId);
                        reportInstanceId = extractReportInstanceIdFromReportUniqId(reportUniqId);
                    }

                    const newTab = {
                        id: tabId,
                        tabDisplayed: true,
                        locationPathname,
                        type: (matchedRoute.route as TPDTabRouteSettings).type,
                        reportInstanceID: reportInstanceId,
                        reportId: reportId,
                    };

                    // console.debug('-- [PathDriveTabs] reportUniqId', reportUniqId);
                    // console.debug('-- [PathDriveTabs] reportInstanceID', reportInstanceId);
                    // console.debug('-- [PathDriveTabs] reportId', reportId);
                    // console.debug('-- [PathDriveTabs] newTab', newTab);

                    return [
                        ...previousTabs.map(tab => ({...tab, tabDisplayed: false})),
                        {
                            ...newTab,
                            component: getPTabRouteComponent(newTab)
                        }
                    ];
                }

            });
        }
    }, [location.pathname, location.search, location.key]);

    // Display the Home tab when we close one tab.
    //
    React.useEffect(() => {

        localStorage.setItem('pathDrivenTabs', JSON.stringify(tabs.map(tab => {
            const {component, ...tabRest} = tab;
            return tabRest;
        })));

        if (tabs.length > 0) {

            // activate home tab if no activated tab
            const activeTabExists = tabs.some(tab => tab.tabDisplayed);
            if (!activeTabExists) {
                navigate('/home');
            }
        }
    }, [tabs, navigate]);

    // Handle special Help tab, when user is connected for the first time.
    //
    React.useEffect(() => {

        if (authState.user.first_connection && !helpTabDisplayed && tabs.length > 0) {

            let newTabs = tabs;
            const helpTab = {
                id: 'tab_help',
                tabDisplayed: false,
                locationPathname: '/help',
                type: tabRouteHelp.type,
            };

            newTabs.push({...helpTab, component: getPTabRouteComponent(helpTab)});

            setHelpTabDisplayed(true);
            setTabs(newTabs);

            navigate('/overview');
        }

    }, [authState.user.first_connection, helpTabDisplayed, tabs, navigate]);

    const activateTabById = (id: string) => {

        const tab = tabs.find(tab => tab.id === id);
        if (tab) {
            navigate(tab.locationPathname);
        }
    }

    const deleteTabById = (id: string) => {

        setTabs(previousTabs => previousTabs.filter(tab => tab.id !== id));
    }

    const reorder = (routes: Array<IPDTabRoute>, startIndex: number, endIndex: number): IPDTabRoute[] => {

        const routesReordered = Array.from(routes);
        const [removed] = routesReordered.splice(startIndex, 1);
        routesReordered.splice(endIndex, 0, removed);

        return routesReordered;
    };

    const onDragEnd = (result: DropResult): void => {

        // If dropped outside the list.
        if (!result.destination) {
            return;
        }

        setTabs(reorder(
            tabs,
            result.source.index,
            result.destination.index
        ));
    }

    const showContextualMenu = (event: React.MouseEvent, items: MenuItem[]) => {

        setContextualMenuItems(items);
        contextMenuRef.current?.show(event);
    };

    return (
        <>
            <div id="pdt-tabs" className={pdtHeaderClassname}>
                {/*I'm here only to load inline styles*/}
                <TabView style={{ display: "none" }} />
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable
                        droppableId="droppable"
                        direction="horizontal">
                        {(provided) => (
                            <div className="p-tabview p-component">
                                <ul ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="p-tabview-nav"
                                    role="tablist"
                                >
                                    {tabs.map((tab, index) => (
                                        <Draggable
                                            key={tab.id}
                                            draggableId={tab.id}
                                            index={index}
                                        >
                                            {(provided: DraggableProvided) => (
                                                <PathDrivenTab
                                                    key={'pdtab_' + tab.id}
                                                    tab={tab}
                                                    onClose={() => deleteTabById(tab.id)}
                                                    onClick={() => activateTabById(tab.id)}
                                                    onContextMenu={(event: React.MouseEvent) => showContextualMenu(
                                                        event,
                                                        [
                                                            {
                                                                label: t('common:close').toString(),
                                                                icon: 'pi pi-fw pi-times-circle',
                                                                className: 'contextual-menu-item',
                                                                command: () => deleteTabById(tab.id),
                                                                template: (item: MenuItem, options: any) =>
                                                                    <MenuItemShortcutTemplate
                                                                        item={item}
                                                                        options={options}
                                                                        shortcut="Alt+Shift+W"
                                                                    />,
                                                            },
                                                            {
                                                                label: t('menu:tab.close_all_tabs').toString(),
                                                                icon: 'pi pi-fw pi-times-circle',
                                                                className: 'contextual-menu-item',
                                                                command: () => navigate('/closeTabs'),
                                                                template: (item: MenuItem, options: any) =>
                                                                    <MenuItemShortcutTemplate
                                                                        item={item}
                                                                        options={options}
                                                                        shortcut="Ctrl+Alt+Shift+W"
                                                                    />,
                                                            },
                                                        ]
                                                    )}
                                                    onReportDeleted={(tabId: string) => deleteTabById(tabId)}
                                                    active={tab.tabDisplayed}
                                                    provided={provided}
                                                />
                                            )}

                                        </Draggable>
                                    ))}

                                    {provided.placeholder}
                                </ul>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            <ContextMenu
                model={contextualMenuItems}
                ref={contextMenuRef}
                className="menu contextual-menu"
            />

            {tabs.map(tab => {

                return (
                    <div
                        className={pdtContentsClassname}
                        key={`pdt-tab-contents-${tab.id}`}
                        style={{display: tab.tabDisplayed ? '' : 'none'}}
                        // style={{visibility: tab.tabDisplayed ? 'visible' : 'hidden'}}
                    >
                        {tab.component}
                    </div>
                )
            })}
        </>
    );
};
export default PathDrivenTabs;