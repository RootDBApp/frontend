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

import TUIGrantOptions from "./TUIGrantOptions";

type TUIGrants = {
    cache: TUIGrantOptions,
    category: TUIGrantOptions,
    conf_connector: TUIGrantOptions,
    directory: TUIGrantOptions,
    draft: TUIGrantOptions,
    draft_queries: TUIGrantOptions,
    group: TUIGrantOptions,
    organization: TUIGrantOptions,
    report: TUIGrantOptions,
    report_data_view: TUIGrantOptions,
    report_data_view_js: TUIGrantOptions,
    report_parameter: TUIGrantOptions,
    report_parameter_input: TUIGrantOptions,
    service_message: TUIGrantOptions,
    system_info: TUIGrantOptions,
    user: TUIGrantOptions,
    user_preferences: TUIGrantOptions,
}

export = TUIGrants;