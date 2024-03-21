import TUIGrants from "../types/TUIGrants";

export const userCanAdminSomeStuff = (userUIGrants: TUIGrants): boolean => {

    return userUIGrants.category.edit
        || userUIGrants.conf_connector.edit
        || userUIGrants.directory.edit
        || userUIGrants.group.edit
        || userUIGrants.organization.edit
        || userUIGrants.user.edit;
}