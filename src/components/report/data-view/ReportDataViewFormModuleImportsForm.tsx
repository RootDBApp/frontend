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

import { t }                                     from "i18next";
import { InputText }                             from "primereact/inputtext";
import * as React                                from 'react';
import TJSModuleImport                           from "../../../types/TJSmoduleImport";
import ButtonWithSpinner, { SubmitButtonStatus } from "../../common/form/ButtonWithSpinner";
import TCategory                                 from "../../../types/TCategory";
import { apiSendRequest }                        from "../../../services/api";

const ReportDataViewFormModuleImportsForm: React.FC<{ jsModuleImport: TJSModuleImport }> = ({jsModuleImport}) => {

    const [submitButtonCreate, setSubmitButtonCreate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonUpdate, setSubmitButtonUpdate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonDelete, setSubmitButtonDelete] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);

    const [displayError, setDisplayError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const resetStates = (): void => {

        setDisplayError(false);
        setErrorMessage('');
    }

    const handleOnCreate = (values: TCategory): void => {

        resetStates();
        setSubmitButtonCreate(SubmitButtonStatus.Validating);

        // apiSendRequest({
        //     method: 'POST',
        //     endPoint: EAPIEndPoint.CATEGORY,
        //     formValues: values,
        //     callbackSuccess: () => {
        //         setSubmitButtonCreate(SubmitButtonStatus.Validated);
        //     },
        //     callbackError: (error) => {
        //
        //         setSubmitButtonCreate(SubmitButtonStatus.NotValidated);
        //         setDisplayError(true);
        //         setErrorMessage(error.message);
        //     }
        // });
    }

    const handleOnUpdate = (values: TCategory): void => {

        resetStates();
        setSubmitButtonUpdate(SubmitButtonStatus.Validating);

        // apiSendRequest({
        //     method: 'PUT',
        //     endPoint: EAPIEndPoint.CATEGORY,
        //     formValues: values,
        //     resourceId: values.id,
        //     callbackSuccess: () => {
        //         setSubmitButtonUpdate(SubmitButtonStatus.Validated);
        //     },
        //     callbackError: (error) => {
        //
        //         setSubmitButtonUpdate(SubmitButtonStatus.NotValidated);
        //         setDisplayError(true);
        //         setErrorMessage(error.message);
        //     }
        // });
    };

    const handleOnDelete = (values: TCategory): void => {

        resetStates();
        setSubmitButtonDelete(SubmitButtonStatus.Validating);

        // apiSendRequest({
        //     method: 'DELETE',
        //     endPoint: EAPIEndPoint.CATEGORY,
        //     resourceId: values.id,
        //     callbackSuccess: () => {
        //     },
        //     callbackError: (error) => {
        //
        //         setSubmitButtonDelete(SubmitButtonStatus.NotValidated);
        //         setDisplayError(true);
        //         setErrorMessage(error.message);
        //     }
        // });
    }

    return (<form onSubmit={() => {
        }}>
            <div className="formgrid grid">
                <div className="field col-12">
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">Module's URL</span>
                        <InputText placeholder="module URL" value={jsModuleImport.url}/>
                        <span className="p-inputgroup-addon">Imported as</span>
                        <InputText placeholder="module URL" value={jsModuleImport.as}/>

                        <ButtonWithSpinner
                            buttonStatus={submitButtonUpdate}
                            labels={
                                (jsModuleImport && jsModuleImport.url !== "")
                                    ? {
                                        default: t('common:form.update').toString(),
                                        validating: t('common:form.updating').toString(),
                                        validated: t('common:form.updated').toString(),
                                        notValidated: t('common:form.update_failed').toString(),
                                    }
                                    : {
                                        default: t('common:form.create').toString(),
                                        validating: t('common:form.creating').toString(),
                                        validated: t('common:form.created').toString(),
                                        notValidated: t('common:form.create_failed').toString(),
                                    }
                            }
                            type="submit"
                        />
                        {jsModuleImport.url !== "" &&
                            <ButtonWithSpinner
                                type="button"
                                buttonStatus={submitButtonDelete}
                                labels={{
                                    default: t('common:form.delete').toString(),
                                    validating: t('common:form.deleting').toString(),
                                    validated: t('common:form.deleted').toString(),
                                    notValidated: t('common:form.delete_failed').toString(),
                                }}
                                severity="danger"
                                onClick={(event) => {
                                    event.preventDefault();
                                }}
                            />}
                    </div>
                </div>
            </div>
        </form>
    );

}

export default ReportDataViewFormModuleImportsForm;
