import * as React         from "react";
import { useTranslation } from "react-i18next";
import { Form, Formik }   from "formik";

import TDataViewMetricForm from "../../../../types/TDataViewMetricForm";
import { Dropdown }        from "primereact/dropdown";
import { PrimeIcons }      from 'primereact/api';

const DataViewMetricGlobalForm: React.FC<{
    globalForm: TDataViewMetricForm['global'],
    onChangeCallback: CallableFunction,
}> = ({
          globalForm,
          onChangeCallback,
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);

    const iconOptionTemplate = (option?: { key: string, icon: string }) => {
        return !!option
            ? (
                <React.Fragment key={option.key}>
                    <i className={`mr-3 ${option.icon}`}/>
                    <small>{option.key.replaceAll('_', ' ').toLowerCase()}</small>
                </React.Fragment>
            )
            : <></>;
    };

    return (
        <Formik
            onSubmit={values => onChangeCallback(values)}
            initialValues={{
                icon: globalForm?.icon || '',
                footer: globalForm?.footer || '',
            }}
            enableReinitialize
        >
            {(formik) => (
                <Form placeholder="">
                    <div className="formgrid grid mx-0 justify-content-between flex-grow-1">
                        <div className="field">
                            <label
                                id="label_icon"
                                htmlFor="icon"
                            >
                                {t('report:dataview.info_view_form.icon').toString()}
                            </label><br/>
                            <Dropdown
                                multiple={false}
                                options={Object.entries(PrimeIcons).map(([key, value]) => ({
                                    key,
                                    icon: value
                                }))}
                                optionValue="icon"
                                optionLabel="key"
                                itemTemplate={iconOptionTemplate}
                                valueTemplate={iconOptionTemplate}
                                filter
                                {...formik.getFieldProps('icon')}
                                onChange={(event) => {
                                    formik.setFieldValue('icon', event.value);
                                    onChangeCallback({...formik.values, icon: event.value});
                                }}
                            />
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default DataViewMetricGlobalForm;
