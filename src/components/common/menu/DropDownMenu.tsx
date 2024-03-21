import { Button }   from "primereact/button";
import { Menu }     from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import * as React   from 'react';
import { TIconPos } from "../../../types/primereact/TIconPos";

const DropDownMenu: React.FC<{
    id: string,
    label: string,
    items: MenuItem[],
    icon?: string,
    iconPos?: TIconPos,
    className?: string
}> = ({
          id,
          label,
          icon,
          iconPos = 'left',
          items,
          className = 'p-button-secondary',
      }) => {
    const menuRef = React.useRef<Menu>(null);
    return (
        <>
            <Button
                type="button"
                id={`${id}-button`}
                label={label}
                icon={icon}
                iconPos={iconPos}
                onClick={
                    (event) => menuRef?.current?.toggle(event)}
                aria-haspopup
                aria-controls={id}
                className={`p-button-text p-p-1 ${className}`}
            />

            <Menu
                model={items}
                popup
                ref={menuRef}
                id={id}
                className="menu"
            />
        </>
    );
};

export default DropDownMenu;