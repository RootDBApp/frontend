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