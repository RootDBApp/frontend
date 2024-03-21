import { ECallbackStatus } from "../components/common/CustomEditor";

type TCallbackResponse = {
    status: ECallbackStatus,
    error?: string
};
export = TCallbackResponse;