import TConnector        from "./TConnector";
import TOrganizationUser from "./TOrganizationUser";

type TOrganization = {
    id: number,
    name: string,
    conf_connectors?: Array<TConnector>
    reports_count?: number,
    // For OrganizationForm
    organization_users?: Array<TOrganizationUser>
    user_ids?: Array<number>
}

export = TOrganization;