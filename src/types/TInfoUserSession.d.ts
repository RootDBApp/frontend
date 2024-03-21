import TUser           from "./TUser";

type TInfoUserSession = {
    logged: boolean,
    superAdmin: boolean,
    user: TUser,
}

export = TInfoUserSession;