import { EPDTTabType } from "../EPDTTabType";

// Interface Path Driven Tab - store the current tab setup.
export interface IPDTabRoute {
    id: string,                              // id = 'tab_id_'  + location.pathname + Date.now() + Math.random()      ( with "/" replaced by "_" )
                                             // or
                                             // id = 'tab_id_' + tabRouteSettings.id + Date.now() + Math.random()
    locationPathname: string,                // location.pathname by default.
    tabDisplayed: boolean,
    type: EPDTTabType,
    component?: React.ReactElement,
    previousLocationPathname?: string,       // When the TPDRoute handle multiple pathname we need to store which one was previously activated.
    reportInstanceID?: number
    reportId?: number,
    reportDataViewId?: number,
    title?: string | React.ReactElement,
}