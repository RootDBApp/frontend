import { Ace } from "ace-builds";

type TConnectorCompletions = {
    connector_id: number,
    completions: Array<Ace.Completion>
}

export = TConnectorCompletions;