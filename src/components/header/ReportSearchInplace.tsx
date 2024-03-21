import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import { Button }                                  from "primereact/button";
import { Tooltip }                                 from "primereact/tooltip";
import * as React                                  from 'react';
import { useTranslation }                          from "react-i18next";

import AutoCompleteReport from "../common/form/AutoCompleteReport";
import env                from "../../envVariables";


const ReportSearchInplace: React.FC<{ alwaysOpen: boolean }> = ({alwaysOpen}): React.ReactElement => {

    const [active, setActive] = React.useState(false);
    const {t} = useTranslation();

    return (
        <>
            <Tooltip target="#menu-search-inplace"
                     position={"bottom"}
                     content={t('report:form.search_report').toString()}
                     showDelay={env.tooltipShowDelay}
                     hideDelay={env.tooltipHideDelay}
            />
            <Inplace
                id="menu-search-inplace"
                active={active || alwaysOpen}
                onToggle={(e) => {
                    if (e.originalEvent) {
                        e.originalEvent.preventDefault();
                    }
                    setActive(e.value)
                }}
            >
                <InplaceDisplay>
                    <Button
                        type="button"
                        icon="pi pi-search"
                        // label={t('report:form.search_report').toString()}
                        className="p-button-text p-button-secondary bg-transparent"
                    />
                </InplaceDisplay>

                <InplaceContent>
                    <div className="ml-3 flex align-items-center">
                        <AutoCompleteReport setInPlaceActive={setActive} autoFocus={!alwaysOpen}/>
                    </div>
                </InplaceContent>
            </Inplace>
        </>
    );
}

export default ReportSearchInplace;