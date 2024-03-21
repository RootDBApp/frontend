import apiClient from "./api";

export function importTheme(
    theme: string,
    callbackSuccess: (cssStyles: string) => void,
    callbackError: () => void
): void {

    apiClient.get('/api/theme/' + theme)
        .then(response => {

            callbackSuccess(response.data);
        }).catch(() => {

        callbackError();
    });
}
