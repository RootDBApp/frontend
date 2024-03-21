import TOrganizationUser from "./TOrganizationUser";

type TUser = {
    email: string,
    email_verified_at: string,
    firstname: string,
    id: number,
    is_active: boolean,
    is_super_admin: boolean,
    lastname: string,
    name: string,
    reset_password?: boolean,
    first_connection?: boolean,
    organization_user: TOrganizationUser,
    organization_users: Array<TOrganizationUser>,
    password?: string,
    // For UserForm
    group_ids?: Array<number>
    organization_id?: number
    role_ids?: Array<number>
}

export = TUser;