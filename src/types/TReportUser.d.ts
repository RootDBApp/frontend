import TUser from "./TUser";

type TReportUser = {
    id: number,
    user_id: number,
    user: TUser
    report_id?: number
}

export = TReportUser;