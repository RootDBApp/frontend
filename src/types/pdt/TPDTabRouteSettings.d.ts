// Type Path Driven Tab Route Settings
import { EPDTTabType } from "../EPDTTabType";
import { RouteObject } from "react-router-dom";

type TPDTabRouteSettings = {
    type: EPDTTabType,
} & RouteObject;

export = TPDTabRouteSettings;