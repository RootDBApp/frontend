import { DataTable } from "primereact/datatable";
import { Divider }   from "primereact/divider";
import { Column }    from "primereact/column";
import React         from "react";

import { apiSendRequest } from "../../services/api";
import { EAPIEndPoint }   from "../../types/EAPIEndPoint";
import env                from "../../envVariables";


const SystemInfo: React.FC = () => {

    const [sysInfoVariables, setSysInfoVariables] = React.useState([
        {
            "front_variable": '', "front_value": '', "api_variable": '', "api_value": ''
        }
    ]);

    const [sysInfoSoftVersions, setInfoSoftVersions] = React.useState([
        {
            "software": '', "version": ''
        }
    ]);

    React.useEffect(() => {

        apiSendRequest({
            method: 'GET',
            endPoint: EAPIEndPoint.SYSTEM_INFO,
            callbackSuccess: (response: any) => {

                setInfoSoftVersions(
                    [
                        {
                            "software": 'RootDB',
                            "version": String(response.app_version)
                        },
                        {
                            "software": 'mariadb_version',
                            "version": String(response.mariadb_version)
                        },
                        {
                            "software": 'mariadb_tls_version',
                            "version": String(response.mariadb_tls_version)
                        },
                        {
                            "software": 'mariadb_version_ssl_library',
                            "version": String(response.mariadb_version_ssl_library)
                        },

                        {
                            "software": 'php_version',
                            "version": String(response.php_version)
                        },
                        {
                            "software": 'memcached_version',
                            "version": String(response.memcached_version)
                        },
                    ]
                );

                setSysInfoVariables(
                    [
                        {
                            "front_variable": 'REACT_APP_API_URL',
                            "front_value": String(env.REACT_APP_API_URL),
                            "api_variable": '',
                            "api_value": ''
                        },
                        {
                            "front_variable": 'REACT_APP_ECHO_CLIENT_AUTHENDPOINT',
                            "front_value": String(env.REACT_APP_ECHO_CLIENT_AUTHENDPOINT),
                            "api_variable": '',
                            "api_value": ''
                        },
                        // {
                        //     "front_variable": 'REACT_APP_ECHO_CLIENT_BROADCASTER',
                        //     "front_value": String(env.REACT_APP_ECHO_CLIENT_BROADCASTER),
                        //     "api_variable": '',
                        //     "api_value": ''
                        // },
                        {
                            "front_variable": 'REACT_APP_ECHO_CLIENT_CLUSTER',
                            "front_value": String(env.REACT_APP_ECHO_CLIENT_CLUSTER),
                            "api_variable": 'broadcasting_connections_pusher_options_cluster',
                            "api_value": String(response.broadcasting_connections_pusher_options_cluster)
                        },
                        {
                            "front_variable": 'REACT_APP_ECHO_CLIENT_FORCE_TLS',
                            "front_value": String(env.REACT_APP_ECHO_CLIENT_FORCE_TLS),
                            "api_variable": 'broadcasting_connections_pusher_options_useTLS',
                            "api_value": String(response.broadcasting_connections_pusher_options_useTLS)
                        },
                        {
                            "front_variable": 'REACT_APP_ECHO_CLIENT_KEY',
                            "front_value": String(env.REACT_APP_ECHO_CLIENT_KEY),
                            "api_variable": 'broadcasting_connections_pusher_key',
                            "api_value": String(response.broadcasting_connections_pusher_key)
                        },
                        {
                            "front_variable": 'REACT_APP_ECHO_CLIENT_WSS_HOST',
                            "front_value": String(env.REACT_APP_ECHO_CLIENT_WSS_HOST),
                            "api_variable": '',
                            "api_value": ''
                        },
                        {
                            "front_variable": 'REACT_APP_ECHO_CLIENT_WS_HOST',
                            "front_value": String(env.REACT_APP_ECHO_CLIENT_WS_HOST),
                            "api_variable": '',
                            "api_value": ''
                        },
                        {
                            "front_variable": 'REACT_APP_ECHO_CLIENT_WSS_PORT',
                            "front_value": String(env.REACT_APP_ECHO_CLIENT_WSS_PORT),
                            "api_variable": '',
                            "api_value": ''
                        },
                        {
                            "front_variable": 'REACT_APP_ECHO_CLIENT_WS_HOST',
                            "front_value": String(env.REACT_APP_ECHO_CLIENT_WS_HOST),
                            "api_variable": '',
                            "api_value": ''
                        },
                        {
                            "front_variable": 'REACT_APP_ECHO_CLIENT_WS_PORT',
                            "front_value": String(env.REACT_APP_ECHO_CLIENT_WS_PORT),
                            "api_variable": '',
                            "api_value": ''
                        },
                        {
                            "front_variable": 'REACT_APP_API_URL',
                            "front_value": String(env.REACT_APP_API_URL),
                            "api_variable": '',
                            "api_value": ''
                        },
                        {
                            "front_variable": 'WDS_SOCKET_HOST',
                            "front_value": String(env.WDS_SOCKET_HOST),
                            "api_variable": '',
                            "api_value": ''
                        },
                        {
                            "front_variable": 'WDS_SOCKET_PATH',
                            "front_value": String(env.WDS_SOCKET_PATH),
                            "api_variable": '',
                            "api_value": ''
                        },
                        {
                            "front_variable": 'WDS_SOCKET_PORT',
                            "front_value": String(env.WDS_SOCKET_PORT),
                            "api_variable": '',
                            "api_value": ''
                        },
                        {
                            "front_variable": '',
                            "front_value": '',
                            "api_variable": 'broadcasting_connections_pusher_options_scheme',
                            "api_value": String(response.broadcasting_connections_pusher_options_scheme)
                        },
                        {
                            "front_variable": '',
                            "front_value": '',
                            "api_variable": 'websockets_ssl_allow_self_signed',
                            "api_value": String(response.websockets_ssl_allow_self_signed)
                        },
                        {
                            "front_variable": '',
                            "front_value": '',
                            "api_variable": 'websockets_ssl_verify_peer',
                            "api_value": String(response.websockets_ssl_verify_peer)
                        },
                        {
                            "front_variable": '',
                            "front_value": '',
                            "api_variable": 'websockets_ssl_local_cert',
                            "api_value": String(response.websockets_ssl_local_cert)
                        },
                        {
                            "front_variable": '',
                            "front_value": '',
                            "api_variable": 'websockets_ssl_local_pk',
                            "api_value": String(response.websockets_ssl_local_pk)
                        },
                        {
                            "front_variable": '',
                            "front_value": '',
                            "api_variable": 'cors_allowed_origin',
                            "api_value": String(response.cors_allowed_origin)
                        },
                        {
                            "front_variable": '',
                            "front_value": '',
                            "api_variable": 'cors_allowed_origins_pattern',
                            "api_value": String(response.cors_allowed_origins_pattern)
                        },
                    ]
                );
            }
        });


    }, []);


    return <>
        <DataTable value={sysInfoSoftVersions} size="small">
            <Column field="software" header="Software"></Column>
            <Column field="version" header="Version"></Column>
        </DataTable>
        <DataTable value={sysInfoVariables} size="small">
            <Column field="front_variable" header="Front variable"></Column>
            <Column field="front_value" header="Value"></Column>
            <Column field="api_variable" header="API variable"></Column>
            <Column field="api_value" header="Value"></Column>
        </DataTable>
        <Divider/>
    </>
}

export default SystemInfo;