import TEditorPreferences   from "../../../types/TEditorPreferences";

export interface IPreferencesState {
    defaultOrganizationId?: number;
    editorPreferences: TEditorPreferences;
    fullScreenActivated: boolean;
}

export const initialState: IPreferencesState = {
    defaultOrganizationId: JSON.parse(String(localStorage.getItem('defaultOrganization'))) || null,
    editorPreferences: JSON.parse(String(localStorage.getItem('editorPreferences'))) || {
        theme: 'monokai',
        fontSize: 14,
        showPrintMargin: false,
        showLineNumbers: false,
        tabSize: 2,
        highlightActiveLine: true,
    },
    fullScreenActivated: false,
}

export default initialState;
