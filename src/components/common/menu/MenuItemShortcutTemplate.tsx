import { MenuItem } from "primereact/menuitem";
import * as React   from "react";

const MenuItemShortcutTemplate: React.FC<{
    item: MenuItem,
    options: any,
    shortcut: string
}> = ({
          item,
          options,
          shortcut
      }) => (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
        href="#"
        style={{width: '100%'}}
        className={`${options.className} p-button-link `}
        // target={item.target}
        onClick={options.onClick}
    >
        <span className={options.iconClassName}/>
        <span className={options.labelClassName}>{item.label}</span>
        <span className={`${options.labelClassName} menu-shortcut p-text-right`}>{shortcut}</span>
    </a>
)

export default MenuItemShortcutTemplate;