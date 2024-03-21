import TOrganization    from "./TOrganization";
import TGroup           from "./TGroup";
import TRole            from "./TRole";
import { ERole }        from "./ERole";
import TUserPreferences from "./TUserPreferences";
import TUIGrants        from "./TUIGrants";

type TOrganizationUser = {
    groups: Array<TGroup>,
    group_ids: Array<number>,
    organization: TOrganization,
    organization_id: number,
    id: number,
    roles: Array<TRole>,
    role_ids: Array<ERole>,
    ui_grants: TUIGrants,
    user_id: number,
    user_preferences: TUserPreferences
}

export = TOrganizationUser;