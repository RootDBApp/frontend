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

import TConnectorDatabase         from "./TConnectorDatabase";
import { EConnectorPgsqlSslMode } from "./EConnectorPgsqlSslMode";
// import TReportBasic         from "./TReportBasic";
// import TParameterInputBasic from "./TParameterInputBasic";

type TConnector = {
    id: number,
    connectorDatabase: TConnectorDatabase,
    connector_database_id: number,
    database: string,
    global: boolean,
    host: string,
    name: string,
    password: string,
    port: number,
    timeout: number,
    username: string,
    use_ssl: boolean,
    check_in_progress?: boolean,
    organization_id?: number,
    raw_grants?: string,
    // reports?: Array<TReportBasic>
    // report_parameter_inputs?: Array<TParameterInputBasic>
    seems_ok?: boolean,
    ssl_cipher?: string,
    ssl_ca?: string,
    ssl_key?: string,
    ssl_cert?: string,
    mysql_ssl_verify_server_cert?: boolean
    pgsql_ssl_mode?: EConnectorPgsqlSslMode
}

export = TConnector;