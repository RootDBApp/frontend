import * as React from "react";

type TMenuItem = {
    icon?: React.ReactNode,
    label?: string,
    onClick?: CallableFunction,
    shortcut?: string,
    divider?: boolean,
};

export = TMenuItem;