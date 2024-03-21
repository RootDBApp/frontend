import { Accordion, AccordionTab } from "primereact/accordion";
import * as React                  from "react";
import { useTranslation }          from "react-i18next";


import ReportLinkForm                   from "./ReportLinkForm";
import { ICallbackOnReportLinksUpdate } from "../../types/ICallBacks";
import TDataViewTableColumnParameter    from "../../types/TDataViewTableColumnParameter";
import TReportLink                      from "../../types/TReportLink";
import apiDataContext                   from "../../contexts/api_data/store/context";
import TReport                          from "../../types/TReport";
import HelpButton                       from "../help/HelpButton";

const ReportLinks: React.FC<{
    columnParameters: Array<TDataViewTableColumnParameter>,
    initialReportLinks: Array<TReportLink>,
    onReportLinksUpdate: ICallbackOnReportLinksUpdate
}> = ({
          columnParameters,
          initialReportLinks,
          onReportLinksUpdate
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);

    const {state: apiDataState} = React.useContext(apiDataContext);

    const updateCurrentReportLinks = (reportLink: TReportLink): void => {

        const reportLinkFound = initialReportLinks.find((reportLinkLooped: TReportLink) => reportLinkLooped.reportId === reportLink.reportId);
        let newReportLinks: Array<TReportLink>;

        if (reportLinkFound) {

            newReportLinks = initialReportLinks.map((reportLinkLooped: TReportLink) => {

                if (reportLinkLooped.reportId === reportLink.reportId) {

                    return reportLink;
                }

                return reportLinkLooped;
            });
        } else {

            newReportLinks = [...initialReportLinks, reportLink];
        }

        onReportLinksUpdate(newReportLinks);
    }

    const deleteFromCurrentReportLinks = (reportLink: TReportLink): void => {

        onReportLinksUpdate(
            initialReportLinks.filter(
                (reportLinkLooped: TReportLink) => reportLinkLooped.reportId !== reportLink.reportId
            )
        );
    }

    const getReportLinkAccordionHeader = (reportLink: TReportLink): string => {

        if (reportLink.label.length > 0) {

            return reportLink.label;
        }

        const reportFound = apiDataState.reports.find((report: TReport) => report.id === reportLink.reportId)
        if (reportFound) {

            return reportFound.name;
        }

        return '/';
    }

    return (
        <>
            <div className="flex justify-content-end">
                <HelpButton className="flex align-items-center justify-content-center mb-2" helpCardPath="report-links"/>
            </div>
            <Accordion activeIndex={0}>
                {initialReportLinks.map(
                    (reportLink: TReportLink, index) => (
                        <AccordionTab
                            key={reportLink.reportId}
                            tabIndex={reportLink.reportId}
                            header={getReportLinkAccordionHeader(reportLink)}
                        >
                            <ReportLinkForm
                                indexForm={index}
                                columnParameters={columnParameters}
                                initialReportLink={reportLink}
                                currentReportLinks={initialReportLinks}
                                onReportLinkUpdate={(reportLink: TReportLink) => {
                                    updateCurrentReportLinks(reportLink);
                                }}
                                onReportLinkDelete={(reportLink: TReportLink) => {
                                    deleteFromCurrentReportLinks(reportLink);
                                }}
                            />
                        </AccordionTab>
                    )
                )}

                <AccordionTab
                    key={9999}
                    tabIndex={9999}
                    header={
                        <span>
                        <i className="pi pi-plus mr-3"/>
                            {t('report:report_link.new_link').toString()}
                        </span>
                    }
                    headerClassName="accordion-new-param"
                    contentClassName="accordion-new-param-content"
                >
                    <ReportLinkForm
                        indexForm={0}
                        columnParameters={columnParameters}
                        initialReportLink={{
                            reportId: 0,
                            label: '',
                            canBeOpenInSameTab: false,
                            parameters: []
                        }}
                        currentReportLinks={initialReportLinks}
                        isNewReportLink
                        onReportLinkUpdate={(reportLink: TReportLink) => {
                            updateCurrentReportLinks(reportLink);
                        }}
                        onReportLinkDelete={(reportLink: TReportLink) => {
                            deleteFromCurrentReportLinks(reportLink);
                        }}
                    />
                </AccordionTab>
            </Accordion>
        </>
    )
};
export default ReportLinks;