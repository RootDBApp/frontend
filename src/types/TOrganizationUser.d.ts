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