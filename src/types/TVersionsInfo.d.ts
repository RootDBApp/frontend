import { EVersionType } from "./EVersionType";

type TVersionInfo = {
    type: EVersionType
    version: string
    available_version: string
    update_available: boolean
    url_release_note: string
}

export = TVersionInfo;