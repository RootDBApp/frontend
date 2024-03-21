import TUser            from "./TUser";

type TUserLogin = TUser & {
    is_licence_valid: boolean,
    web_socket_session_id: string
}

export = TUserLogin;