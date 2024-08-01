/*
 * This file is part of RootDB.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * AUTHORS
 * PORQUET Sébastien <sebastien.porquet@ijaz.fr>
 * ROBIN Brice <brice@robri.net>
 */

import { InputText }      from "primereact/inputtext";
import { Dropdown }       from "primereact/dropdown";
import { Slider }         from 'primereact/slider';
import { InputSwitch }    from "primereact/inputswitch";
import * as React         from 'react';
import { useTranslation } from "react-i18next";
import { Form, Formik }   from "formik";

import { editorPreferencesChanged }      from "../../contexts/preferences/store/actions";
import { context as preferencesContext } from "../../contexts/preferences/store/context";

const EditorPreference: React.FC = (): React.ReactElement => {

    const {t} = useTranslation('settings');
    const {preferencesState, preferencesStateDispatch: preferencesDispatch} = React.useContext(preferencesContext);

    return (

        <Formik
            onSubmit={(values) => {
                preferencesDispatch(editorPreferencesChanged(values))
            }}
            initialValues={{
                theme: preferencesState.editorPreferences.theme,
                fontSize: preferencesState.editorPreferences.fontSize,
                showPrintMargin: preferencesState.editorPreferences.showPrintMargin,
                showLineNumbers: preferencesState.editorPreferences.showLineNumbers,
                tabSize: preferencesState.editorPreferences.tabSize,
                highlightActiveLine: preferencesState.editorPreferences.highlightActiveLine
            }}
        >

            {(formik) => (
                <Form onSubmit={formik.handleSubmit}
                      style={{minWidth: '38rem'}}
                >
                    <div className="formgrid grid">

                        <div className="field col-12 md:col-6">
                            <label htmlFor="theme">{t('editor_preferences.theme')}</label>
                            <Dropdown id="theme"
                                      name="theme"
                                      value={formik.values.theme}
                                      options={[
                                          {label: 'Monokai', value: 'monokai'},
                                          {label: 'Solarized Light', value: 'solarized_light'},
                                          {label: 'Solarized Dark', value: 'solarized_dark'},
                                          {label: 'Terminal', value: 'terminal'},
                                      ]}
                                      onChange={(event) => {
                                          formik.handleChange(event);
                                          formik.handleSubmit();
                                      }}
                                      className="w-full"
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="tabSize">{t('editor_preferences.tab_size')}</label>
                            <InputText value={String(formik.values.tabSize)} className="w-full" readOnly/>
                            <Slider
                                id="tabSize"
                                value={formik.values.tabSize}
                                min={1}
                                max={10}
                                onChange={(event) => {
                                    formik.handleChange({
                                        target: {value: event.value, name: 'tabSize'}
                                    });
                                    formik.handleSubmit();

                                }}
                                className="w-full"
                            />
                        </div>

                        <div className="field col-12  md:col-6">
                            <label htmlFor="fontSize">{t('editor_preferences.font_size')}</label>
                            <InputText value={String(formik.values.fontSize)} className="w-full" readOnly/>
                            <Slider
                                id="fontSize"
                                value={formik.values.fontSize}
                                min={10}
                                max={40}
                                onChange={(event) => {
                                    formik.handleChange({
                                        target: {value: event.value, name: 'fontSize'}
                                    });
                                    formik.handleSubmit();

                                }}
                                className="w-full"
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="showPrintMargin">{t('editor_preferences.show_print_margin')}</label><br/>
                            <InputSwitch
                                id="showPrintMargin"
                                checked={formik.values.showPrintMargin}
                                onChange={(event) => {
                                    formik.handleChange(event);
                                    formik.handleSubmit();
                                }}
                            />
                        </div>


                        <div className="field col-12 md:col-6">
                            <label htmlFor="showLineNumbers">{t('editor_preferences.show_line_number')}</label><br/>
                            <InputSwitch
                                id="showLineNumbers"
                                checked={formik.values.showLineNumbers}
                                onChange={(event) => {
                                    formik.handleChange(event);
                                    formik.handleSubmit();
                                }}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="highlightActiveLine">{t('editor_preferences.highlight_active_line')}</label><br/>
                            <InputSwitch
                                id="highlightActiveLine"
                                checked={formik.values.highlightActiveLine}
                                onChange={(event) => {
                                    formik.handleChange(event);
                                    formik.handleSubmit();
                                }}
                            />
                        </div>

                    </div>

                </Form>
            )}
        </Formik>
    );
}

export default EditorPreference;
