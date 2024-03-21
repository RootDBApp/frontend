import { Badge }                 from "primereact/badge";
import { Image }                 from "primereact/image";
import { Divider }               from "primereact/divider";
import { Trans, useTranslation } from "react-i18next";
import * as React                from "react";

import i01 from "../../images/help/report_links/01.jpg"
import i02 from "../../images/help/report_links/02.jpg"
import i03 from "../../images/help/report_links/03.jpg"
import i04 from "../../images/help/report_links/04.jpg"
import i05 from "../../images/help/report_links/05.jpg"

const ReportLinks = (): React.ReactElement => {

    const {t} = useTranslation('help');

    return <>
        <Divider layout="horizontal" align="left" type="solid">
            <i className="pi pi-info-circle mr-2"></i>{t('help:cards.report_links.to_know.title').toString()}
        </Divider>
        <div className="grid">
            <div className="col-12 md:col-12 lg:col-12">
                <p>
                    <Trans i18nKey="help:cards.report_links.to_know.1"/><br/>
                    <Trans i18nKey="help:cards.report_links.to_know.2">
                        For an example with a chart, like Chart.js for instance, you can see real-world examples on the <a className="help-link " href="https://demo.rootdb.fr/" target="_blank" rel="noreferrer">demo website<i className="pi pi-external-link ml-2"></i></a>.
                    </Trans>
                </p>
            </div>
        </div>

        <Divider layout="horizontal" align="left" type="solid">
            {t('help:cards.report_links.example_report.title').toString()}
        </Divider>
        <div className="grid">
            <div className="col-12 md:col-12 lg:col-8">
                <p>
                    <Badge value="1" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.report_links.example_report.1"/>
                </p>
            </div>
            <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                <Image src={i01} alt={i01} width="350" preview imageClassName="responsive-img"/>
            </div>
        </div>

        <Divider layout="horizontal" align="left" type="solid">
            {t('help:cards.report_links.report_with_links.title').toString()}
        </Divider>
        <div className="grid">
            <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                <Image src={i02} alt={i02} width="350" preview imageClassName="responsive-img"/>
            </div>
            <div className="col-12 md:col-12 lg:col-8">
                <p>
                    <Badge value="1" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.report_links.report_with_links.1"/>&nbsp;&nbsp;
                    <Badge value="2" className="mr-2" size="normal"/>
                </p>
                <p>
                    <ul>
                        <li><Trans i18nKey="help:cards.report_links.report_with_links.2"/></li>
                        <li><Trans i18nKey="help:cards.report_links.report_with_links.3"/>
                            <ul>
                                <li><Trans i18nKey="help:cards.report_links.report_with_links.4"/></li>
                                <li><Trans i18nKey="help:cards.report_links.report_with_links.5"/></li>
                            </ul>
                        </li>
                    </ul>
                </p>
            </div>
        </div>

        <Divider layout="horizontal" align="left" type="solid">
            {t('help:cards.report_links.access_report_link_configuration.title').toString()}
        </Divider>
        <div className="grid">
            <div className="col-12 md:col-12 lg:col-8">
                <p>
                    <Badge value="1" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.report_links.access_report_link_configuration.1"/>
                </p>
                <p>
                    <Badge value="2" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.report_links.access_report_link_configuration.2"/>
                </p>
            </div>
            <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                <Image src={i03} alt={i03} width="350" preview imageClassName="responsive-img"/>
            </div>
        </div>

        <Divider layout="horizontal" align="left" type="solid">
            {t('help:cards.report_links.report_link_configuration.title').toString()}
        </Divider>
        <div className="grid">
            <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                <Image src={i04} alt={i04} width="350" preview imageClassName="responsive-img"/>
            </div>
            <div className="col-12 md:col-12 lg:col-8">
                <p>
                    <Badge value="1" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.report_links.report_link_configuration.1"/>
                </p>
                <p>
                    <Badge value="2" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.report_links.report_link_configuration.2"/>
                </p>
                <p>
                    <Badge value="3" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.report_links.report_link_configuration.3"/>
                </p>
                <p>
                    <Badge value="4" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.report_links.report_link_configuration.4.1"/>
                    <ul>
                        <li><Trans i18nKey="help:cards.report_links.report_link_configuration.4.2"/>&nbsp;&nbsp;<Badge value="5" className="mr-2" size="normal"/></li>
                        <li><Trans i18nKey="help:cards.report_links.report_link_configuration.4.3"/>&nbsp;&nbsp;<Badge value="5" className="mr-2" size="normal"/></li>
                    </ul>
                </p>
            </div>
        </div>


        <Divider layout="horizontal" align="left" type="solid">
            {t('help:cards.report_links.link_same_report.title').toString()}
        </Divider>
        <div className="grid">
            <div className="col-12 md:col-12 lg:col-8">
                <p>
                    <Badge value="1" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.report_links.link_same_report.1"/>
                </p>
            </div>
            <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                <Image src={i05} alt={i05} width="350" preview imageClassName="responsive-img"/>
            </div>
        </div>
    </>
}

export default ReportLinks;