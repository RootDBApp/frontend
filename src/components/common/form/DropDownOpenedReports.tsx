import { Dropdown, DropdownProps }  from "primereact/dropdown";
import * as React                   from "react";
import { useTranslation }           from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import TReport              from "../../../types/TReport";
import { useOpenedReports } from "../../../utils/hooks";

const DropDownOpenedReports: React.FC<{} & DropdownProps> = (): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);
    const navigate = useNavigate();
    const location = useLocation();
    const openedReports = useOpenedReports();
    const [selectedReportId, setSelectedReportId] = React.useState<number>();

    React.useEffect(() => {

        const matchDebugReportId = new RegExp(/debug\/report\/(\d{1,10})/g).exec(location.pathname);

        if (matchDebugReportId) {

            // @ts-ignore
            setSelectedReportId(Number(matchDebugReportId[1]));
        }

    }, [location]);

    return (<>
            {!!openedReports && openedReports.length > 0
                ? <Dropdown value={selectedReportId}
                            onChange={(event) => {

                                setSelectedReportId(event.value);
                                navigate(`/debug/report/${event.value}`);
                            }}
                            options={openedReports.map(
                                (report: TReport) => {

                                    return {id: report.id, name: report.name}
                                }
                            )}
                            optionValue="id"
                            optionLabel="name"
                            placeholder={t('report:select_report').toString()}
                            className="w-full md:w-10rem"
                />
                : <></>
            }
        </>
    )
};


export default DropDownOpenedReports;