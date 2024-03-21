import TOrganization from "./TOrganization";

type TServiceMessage = {
    id: number,
    title: string,
    contents: string
    organizations: Array<TOrganization>
}

export = TServiceMessage;