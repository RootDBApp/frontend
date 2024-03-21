type TDirectory = {
    id: number,
    description: string,
    name: string,
    organization_id: number,
    parent_id?: number
}

export = TDirectory;