import { Accordion, AccordionTab } from "primereact/accordion";
import * as React                  from "react";
import { useTranslation }          from "react-i18next";


import { ICallbackOnExternalLinksUpdate } from "../../types/ICallBacks";
import TDataViewTableColumnParameter      from "../../types/TDataViewTableColumnParameter";
import HelpButton                         from "../help/HelpButton";
import TExternalLink                      from "../../types/TExternalLink";
import ExternalLinkForm                   from "./ExternalLinkForm";

const ExternalLinks: React.FC<{
    columnParameters: Array<TDataViewTableColumnParameter>,
    initialLinks: Array<TExternalLink>,
    onLinksUpdate: ICallbackOnExternalLinksUpdate
}> = ({
          columnParameters,
          initialLinks,
          onLinksUpdate
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);

    const updateCurrentLinks = (link: TExternalLink): void => {

        const linkFound = initialLinks.find((linkLooped: TExternalLink) => linkLooped.label === link.initialLabel);
        let newLinks: Array<TExternalLink>;

        if (linkFound) {

            newLinks = initialLinks.map((linkLooped: TExternalLink) => {

                if (linkLooped.label === link.initialLabel) {

                    return link;
                }

                return linkLooped;
            });
        } else {

            newLinks = [...initialLinks, link];
        }

        onLinksUpdate(newLinks);
    }

    const deleteFromCurrentLinks = (link: TExternalLink): void => {

        onLinksUpdate(
            initialLinks.filter(
                (linkLooped: TExternalLink) => linkLooped.label !== link.label
            )
        );
    }

    return (
        <>
            <div className="flex justify-content-end">
                <HelpButton className="flex align-items-center justify-content-center mb-2" helpCardPath="report-links"/>
            </div>
            <Accordion activeIndex={0}>
                {initialLinks.map(
                    (link: TExternalLink, index) => (
                        <AccordionTab
                            key={link.label}
                            tabIndex={index}
                            header={link.label || ''}
                        >
                            <ExternalLinkForm
                                indexForm={index}
                                columnParameters={columnParameters}
                                initialLink={link}
                                currentLinks={initialLinks}
                                onLinkUpdate={(link: TExternalLink) => {
                                    updateCurrentLinks(link);
                                }}
                                onLinkDelete={(link: TExternalLink) => {
                                    deleteFromCurrentLinks(link);
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
                    <ExternalLinkForm
                        indexForm={0}
                        columnParameters={columnParameters}
                        initialLink={{
                            url: '',
                            label: '',
                        }}
                        currentLinks={initialLinks}
                        isNewLink
                        onLinkUpdate={(link: TExternalLink) => {
                            updateCurrentLinks(link);
                        }}
                        onLinkDelete={(link: TExternalLink) => {
                            deleteFromCurrentLinks(link);
                        }}
                    />
                </AccordionTab>
            </Accordion>
        </>
    )
};
export default ExternalLinks;