import { ERole } from "./ERole";

type THelpCard = {
    dialogContent: React.ReactElement
    group_translation_key: string,
    image: string
    key: string,
    path: string,
    roles: Array<ERole>
}

export = THelpCard;