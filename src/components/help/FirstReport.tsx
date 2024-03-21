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

import { Badge }                 from "primereact/badge";
import { Image }                 from "primereact/image";
import { Divider }               from "primereact/divider";
import * as React                from "react";
import { Trans, useTranslation } from "react-i18next";
// import ReactPlayer               from "react-player";


import i01 from "../../images/help/first_report/01.jpg"
import i02 from "../../images/help/first_report/02.jpg"
import i03 from "../../images/help/first_report/03.jpg"
import i04 from "../../images/help/first_report/04.jpg"
import i05 from "../../images/help/first_report/05.jpg"
import i06 from "../../images/help/first_report/06.jpg"
import i07 from "../../images/help/first_report/07.jpg"
import i08 from "../../images/help/first_report/08.jpg"
// import i09 from "../../images/help/first_report/09.jpg"
// import i10 from "../../images/help/first_report/10.jpg"

const FirstReport = (): React.ReactElement => {

    const {t} = useTranslation('help');

    return <>
        <Divider layout="horizontal" align="left" type="solid">
            <i className="pi pi-info-circle mr-2"></i>{t('help:cards.first_report.to_know.title').toString()}
        </Divider>
        <div className="grid">
            <div className="col-12 md:col-12 lg:col-12">
                <p>
                    <Trans i18nKey="help:cards.first_report.to_know.1"/>
                </p>
            </div>
        </div>

        <Divider layout="horizontal" align="left" type="solid">
            {t('help:cards.first_report.where_to_start.title').toString()}
        </Divider>
        <div className="grid">
            <div className="col-12 md:col-12 lg:col-8">
                <p>
                    <Badge value="1" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.where_to_start.1"/>
                </p>
                <p>
                    <Badge value="2" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.where_to_start.2"/>
                </p>
            </div>
            <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                <Image src={i01} alt={i01} width="350" preview imageClassName="responsive-img"/>
            </div>
        </div>


        <Divider layout="horizontal" align="left" type="solid">
            {t('help:cards.first_report.report_configuration.title').toString()}
        </Divider>
        <div className="grid">
            <div className="col-12 md:col-12 lg:col-8">
                <p>
                    <Badge value="1" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.report_configuration.1"/>
                </p>
                <p>
                    <Badge value="2" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.report_configuration.2"/>
                </p>
                <p>
                    <Badge value="3" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.report_configuration.3"/>
                </p>
                <p>
                    <Badge value="4" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.report_configuration.4"/>
                </p>
                <p>
                    <Badge value="5" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.report_configuration.5"/>
                </p>
            </div>
            <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                <Image src={i02} alt={i02} width="350" preview imageClassName="responsive-img"/>
            </div>
        </div>


        <Divider layout="horizontal" align="left" type="solid">
            {t('help:cards.first_report.report_data_view_configuration.title').toString()}
        </Divider>
        <div className="grid">
            <div className="col-12 md:col-12 lg:col-8">
                <p>
                    <Trans i18nKey="help:cards.first_report.report_data_view_configuration.0"/>
                </p>
                <p>
                    <Badge value="1" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.report_data_view_configuration.1"/>
                </p>
                <p>
                    <Badge value="2" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.report_data_view_configuration.2"/>
                </p>
                <p>
                    <Badge value="3" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.report_data_view_configuration.3"/>
                </p>
                <p>
                    <Badge value="4" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.report_data_view_configuration.4"/>
                </p>
            </div>
            <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                <Image src={i03} alt={i03} width="350" preview imageClassName="responsive-img"/>
            </div>
        </div>
        <div className="grid">
            <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                <Image src={i04} alt={i04} width="350" preview imageClassName="responsive-img"/>
            </div>
            <div className="col-12 md:col-12 lg:col-8">
                <p>
                    <Badge value="1" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.report_data_view_configuration.5"/>
                </p>
                <p>
                    <Badge value="2" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.report_data_view_configuration.6"/>
                </p>
            </div>
        </div>


        <Divider layout="horizontal" align="left" type="solid">
            {t('help:cards.first_report.report_parameters.title').toString()}
        </Divider>
        <div className="grid">
            <div className="col-12 md:col-12 lg:col-8">
                <p>
                    <Trans i18nKey="help:cards.first_report.report_parameters.0"/>
                </p>
                <p>
                    <Badge value="2" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.report_parameters.1"/>
                </p>
            </div>
            <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                <Image src={i05} alt={i05} width="350" preview imageClassName="responsive-img"/>
            </div>
        </div>


        <Divider layout="horizontal" align="left" type="solid">
            {t('help:cards.first_report.development_interface.title').toString()}
        </Divider>
        <div className="grid">
            <div className="col-12 md:col-12 lg:col-6">
                <p>
                    <Trans i18nKey="help:cards.first_report.development_interface.0"/>
                </p>
                <p>
                    <Badge value="1" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.development_interface.1"/>
                </p>
                <p>
                    <Badge value="2" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.development_interface.2"/>
                </p>
                <p>
                    <Badge value="3" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.development_interface.3"/>
                </p>
                <p>
                    <Badge value="4" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.development_interface.4"/>
                </p>
                <p>
                    <Badge value="5" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.development_interface.5"/>
                </p>
                <p>
                    <Badge value="6" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.development_interface.6"/>
                </p>
                <Badge value="7" className="mr-2" size="normal"/>
                <Trans i18nKey="help:cards.first_report.development_interface.7"/>
                <ul>
                    <li><Trans i18nKey="help:cards.first_report.development_interface.7_1"/></li>
                    <li><Trans i18nKey="help:cards.first_report.development_interface.7_2"/></li>
                    <li><Trans i18nKey="help:cards.first_report.development_interface.7_3"/></li>
                </ul>
                <p>
                    <Badge value="8" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.development_interface.8"/>
                </p>
                <p>
                    <Badge value="9" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.development_interface.9"/>
                </p>
                <p>
                    <Badge value="10" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.development_interface.10"/>
                </p>
                <p>
                    <Badge value="11" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.development_interface.11"/>
                </p>
                <p>
                    <Badge value="12" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.first_report.development_interface.12"/>
                </p>
            </div>
            <div className="col-12 md:col-12 lg:col-6 flex align-items-center justify-content-center">
                <Image src={i06} alt={i06} preview width="600" imageClassName="responsive-img"/>
            </div>
        </div>


        <div className="grid">
            <div className="col-12 md:col-12 lg:col-6">
                <Divider layout="horizontal" align="left" type="solid">
                    {t('help:cards.first_report.auto_completion.title').toString()}
                </Divider>
                <div className=" flex align-items-center justify-content-center">
                    <Image src={i08} alt={i08} width="450" preview imageClassName="responsive-img"/>
                </div>
            </div>

            <div className="col-12 md:col-12 lg:col-6">
                <Divider layout="horizontal" align="left" type="solid">
                    {t('help:cards.first_report.raw_data.title').toString()}
                </Divider>
                <div className=" flex align-items-center justify-content-center">
                    <Image src={i07} alt={i07} width="450" preview imageClassName="responsive-img"/>
                </div>
            </div>
        </div>


        {/*<Divider layout="horizontal" align="left" type="solid">*/}
        {/*    {t('help:cards.first_report.access_layout_setup.title').toString()}*/}
        {/*</Divider>*/}
        {/*<div className="grid">*/}
        {/*    <div className="col-12 md:col-12 lg:col-8">*/}
        {/*        <p>*/}
        {/*            <Trans i18nKey="help:cards.first_report.access_layout_setup.0"/>*/}
        {/*        </p>*/}
        {/*        <p>*/}
        {/*            <Badge value="1" className="mr-2" size="normal"/>*/}
        {/*            <Trans i18nKey="help:cards.first_report.access_layout_setup.1"/>*/}
        {/*        </p>*/}
        {/*        <p>*/}
        {/*            <Badge value="2" className="mr-2" size="normal"/>*/}
        {/*            <Trans i18nKey="help:cards.first_report.access_layout_setup.2"/>*/}
        {/*        </p>*/}
        {/*    </div>*/}
        {/*    <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">*/}
        {/*        <Image src={i09} alt={i09} width="350" preview imageClassName="responsive-img"/>*/}
        {/*    </div>*/}
        {/*</div>*/}


        {/*<Divider layout="horizontal" align="left" type="solid">*/}
        {/*    {t('help:cards.first_report.layout_setup.title').toString()}*/}
        {/*</Divider>*/}
        {/*<div className="grid">*/}
        {/*    <div className="col-12 md:col-12 lg:col-8">*/}
        {/*        <p>*/}
        {/*            <Badge value="1" className="mr-2" size="normal"/>*/}
        {/*            <Trans i18nKey="help:cards.first_report.layout_setup.1"/>*/}
        {/*        </p>*/}
        {/*        <p>*/}
        {/*            <Badge value="2" className="mr-2" size="normal"/>*/}
        {/*            <Trans i18nKey="help:cards.first_report.layout_setup.2"/>*/}
        {/*        </p>*/}
        {/*        <p>*/}
        {/*            <Badge value="3" className="mr-2" size="normal"/>*/}
        {/*            <Trans i18nKey="help:cards.first_report.layout_setup.3"/>*/}
        {/*        </p>*/}
        {/*        <p>*/}
        {/*            <Badge value="4" className="mr-2" size="normal"/>*/}
        {/*            <Trans i18nKey="help:cards.first_report.layout_setup.4"/>*/}
        {/*        </p>*/}
        {/*        <p>*/}
        {/*            <Trans i18nKey="help:cards.first_report.layout_setup.5"/>*/}
        {/*        </p>*/}
        {/*    </div>*/}
        {/*    <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">*/}
        {/*        <Image src={i10} alt={i10} width="350" preview imageClassName="responsive-img"/>*/}
        {/*    </div>*/}
        {/*</div>*/}
    </>

}

export default FirstReport;