import { Button }                   from "primereact/button";
import * as React                   from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { CellContext }              from "@tanstack/react-table";


import TReportLink                                  from "../../../../types/TReportLink";
import { EReportLinkParameterValueType }            from "../../../../types/EReportLinkParameterValueType";
import { generateReportUniqId, nameValuesToString } from "../../../../utils/tools";
import { TNameValue }                               from "../../../../types/TNameValue";
import TReportLinkParameter                         from "../../../../types/TReportLinkParameter";
import TExternalLink                                from "../../../../types/TExternalLink";

export const isReportLink = (link: TReportLink | TExternalLink): link is TReportLink => {
    return !!(link as TReportLink).reportId;
}

const DataViewTableLinkedCell: React.FC<{
    cell: CellContext<any, any>,
    showLinksInOverlayPanel: Function,
    reportLinks: Array<TReportLink>,
    externalLinks: Array<TExternalLink>,
    reportParameterInputValues?: Array<TNameValue>,
}> = ({
          cell,
          showLinksInOverlayPanel,
          reportLinks,
          externalLinks,
          reportParameterInputValues,
      }): React.ReactElement => {

    const navigate = useNavigate();
    const location = useLocation()

    const handleClick = (reportLink: TReportLink) => {

        const params = reportLink.parameters
            .filter((reportLinkParameter: TReportLinkParameter) => !reportLinkParameter.ignore)
            .map((reportLinkParameter: TReportLinkParameter) => {

                const name = reportLinkParameter.linkedReportParameterVariableName;
                let value;

                if (reportLinkParameter.linkedReportParameterVariableValueType === EReportLinkParameterValueType.COLUMN_VALUE) {

                    value = cell.row.original[reportLinkParameter.parameterVariableValueName] || '';
                } else if (reportLinkParameter.linkedReportParameterVariableValueType === EReportLinkParameterValueType.REPORT_PARAMETER) {

                    value = reportParameterInputValues?.find((reportParameterInputValue: TNameValue) => reportParameterInputValue.name === reportLinkParameter.parameterVariableValueName)?.value;
                }

                return {name, value};
            })

        if (reportLink.canBeOpenInSameTab) {

            navigate(`${location.pathname}?${nameValuesToString(params)}&run`);
        } else {

            navigate(`/report/${generateReportUniqId(reportLink.reportId)}?${nameValuesToString(params)}&run`);
        }
    }

    const replaceInUrl = (url: string): string => {
        let resultUrl = url;

        reportParameterInputValues?.forEach(param => {
            resultUrl = resultUrl.replaceAll(`[[${param.name}]]`, String(param.value));
        })

        Object.entries(cell.row.original).forEach(([key, value]) => {
            resultUrl = resultUrl.replaceAll(`{{${key}}}`, String(value));
        })

        return resultUrl;
    }

    const displayableLinks: Array<TReportLink | TExternalLink> | undefined = [
        // @todo explain the purpose of this filter.
        ...reportLinks.filter(
            (reportLink: TReportLink) => {

                return reportLink.parameters
                    .filter((reportLinkParameter: TReportLinkParameter) => reportLinkParameter.linkedReportParameterVariableValueType === EReportLinkParameterValueType.COLUMN_VALUE)
                    .every((reportLinkParameter: TReportLinkParameter) => {

                        return (![0, '0', '', null].includes(cell.row.original[reportLinkParameter.parameterVariableValueName]) || reportLinkParameter.emptyValue)
                    })

            }
        ),

        // check if we have link on same report, and if we dev want user to be able to open click on this link without opening a new tab.
        ...reportLinks.filter((reportLink: TReportLink) => reportLink.canBeOpenInSameTab)
            .map((reportLink: TReportLink) => {
                // Yes, we setup canBeOpenInSameTab = false because, the first link will be display with the external icon and this one, with the normal icon for link.
                return {...reportLink, canBeOpenInSameTab: false}
            }),

        ...externalLinks
    ];

    if (displayableLinks && displayableLinks.length > 0) {

        // If only one link on the column, no need to create an overlay.
        if (displayableLinks.length === 1) {

            const link = displayableLinks[0];

            return (
                <Button
                    type="button"
                    label={cell.getValue()}
                    onClick={isReportLink(link)
                        ? () => handleClick(link)
                        : () => window.open(replaceInUrl(link.url), '_blank')}
                    icon="pi pi-external-link"
                    className="p-button-link text-default report-link pl-0"
                    tooltip={link.label}
                    tooltipOptions={{position: 'top'}}
                />
            );
        } else {

            return (
                <Button
                    type="button"
                    label={cell.getValue()}
                    onClick={(event) => {

                        showLinksInOverlayPanel(
                            event,
                            displayableLinks.map(
                                (link) => ({
                                    ...link,
                                    url: !isReportLink(link) ? replaceInUrl(link.url) : undefined,
                                    handleClick: isReportLink(link) ? () => handleClick(link) : undefined,
                                })
                            )
                        );
                    }}
                    icon="pi pi-link"
                    className="p-button-link text-default report-link pl-0"
                />
            );
        }
    }

    if (cell.getValue() === undefined) {

        console.debug('DataViewTableLinkedCell - instance.value is undefined.');
    }

    return cell.getValue() || null;
};

export default DataViewTableLinkedCell;