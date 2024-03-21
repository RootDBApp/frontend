import { BaseCompletion } from "ace-builds";

interface IAceCompletion extends BaseCompletion {
    name: string,
}

export type TAceCompletion = IAceCompletion | ValueCompletion;