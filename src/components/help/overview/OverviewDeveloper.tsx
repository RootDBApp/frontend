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
import * as React                from "react";
import { Trans, useTranslation } from "react-i18next";

import { ICallbackOverviewItems } from "../../../types/ICallBacks";

import i01 from "../../../images/quick_overview/interface_overview_dev_1.jpg"
import i02 from "../../../images/quick_overview/interface_overview_dev_2.jpg"
import i03 from "../../../images/quick_overview/interface_overview_dev_3.jpg"
import i04 from "../../../images/quick_overview/interface_overview_dev_4.jpg"

import HelpButton from "../HelpButton";

const OverviewDeveloper: React.FC<{
    activeIndex: number,
    setItems: ICallbackOverviewItems
}> = ({activeIndex, setItems}): React.ReactElement => {

    const {t} = useTranslation('help');

    React.useEffect(() => {
        setItems([
            {
                label: t('help:quick_overview.dev.0.title').toString(),
            },
            {
                label: t('help:quick_overview.dev.1.title').toString(),
            },
            {
                label: t('help:quick_overview.dev.2.title').toString(),
            },
            {
                label: t('help:quick_overview.dev.3.title').toString(),
            },
            {
                label: t('help:quick_overview.dev.4.title').toString(),
            },
            {
                label: t('help:quick_overview.dev.5.title').toString(),
            },
            {
                label: t('help:quick_overview.dev.6.title').toString(),
            }
        ]);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>
        {activeIndex === 0 && (
            <>
                <p>
                    <Trans i18nKey="help:quick_overview.dev.0.1"/>
                </p>
                <p>
                    <Trans i18nKey="help:quick_overview.dev.0.2"/>
                </p>
                <p>
                    <Trans i18nKey="help:quick_overview.dev.0.3"/>
                </p>
            </>
        )}

        {activeIndex === 1 && (<div className="grid">
            <p>
                <Trans i18nKey="help:quick_overview.dev.1.9"/><br/>
                <Trans i18nKey="help:quick_overview.dev.1.10"/><br/>
                <Trans i18nKey="help:quick_overview.common.consult_help"/>
                <HelpButton
                    helpCardPath="configure-connector"
                    className="ml-2 pl-0 pt-0 pb-0"
                    text
                    customLabel={t('help:cards.configure_connector.subtitle').toString()}
                />
            </p>

            <div className="col-12">
                <p>
                    <Trans i18nKey="help:quick_overview.dev.1.1"/>
                </p>
                <ul>
                    <li><Trans i18nKey="help:quick_overview.dev.1.2"/></li>
                    <li><Trans i18nKey="help:quick_overview.dev.1.3"/></li>
                    <li><Trans i18nKey="help:quick_overview.dev.1.4"/></li>
                </ul>
                <p>
                    <Trans i18nKey="help:quick_overview.dev.1.5"/>
                </p>
                <ul>
                    <li><Trans i18nKey="help:quick_overview.dev.1.6"/></li>
                    <li><Trans i18nKey="help:quick_overview.dev.1.7"/></li>
                    <li><Trans i18nKey="help:quick_overview.dev.1.8"/></li>
                </ul>
            </div>
        </div>)}

        {activeIndex === 2 && (<div className="grid">
            <div className="col-12">
                <p>
                    <Trans i18nKey="help:quick_overview.dev.2.1"/>
                </p>
                <ul>
                    <li><Trans i18nKey="help:quick_overview.dev.2.2"/></li>
                    <li><Trans i18nKey="help:quick_overview.dev.2.3"/></li>
                </ul>
                <p>
                    <Trans i18nKey="help:quick_overview.dev.2.4"/>
                </p>
            </div>
        </div>)}

        {activeIndex === 3 && (<div className="grid">
            <div className="col-12 md:col-12 lg:col-8">
                <Trans i18nKey="help:quick_overview.dev.3.0"/>
                <p>
                    <Badge value="1" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.3.1"/>
                </p>
                <p>
                    <Badge value="2" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.3.2"/>
                </p>
                <p>
                    <Badge value="3" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.3.3"/>
                </p>
                <p>
                    <Badge value="4" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.3.4"/>
                </p>
                <p>
                    <Badge value="5" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.3.5"/>
                </p>
                <p>
                    <Badge value="6" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.3.6"/>&nbsp;(<Trans
                    i18nKey="help:quick_overview.common.consult_help"/>
                    <HelpButton
                        helpCardPath="report-parameters"
                        className="ml-2 pt-0 pl-0 pb-0 pr-0"
                        text
                        customLabel={t('help:cards.report_parameters.title').toString()}
                    />)
                </p>
                <p>
                    <Badge value="7" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.3.7"/>
                </p>
                <p>
                    <Badge value="8" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.3.8"/>
                </p>
            </div>
            <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                <Image src={i01} alt={i01} width="350" preview imageClassName="responsive-img"/>
            </div>
        </div>)}

        {activeIndex === 4 && (<div className="grid">
            <div className="col-12 md:col-12 lg:col-8">
                <p>
                    <Badge value="1" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.4.1"/>
                </p>
                <p>
                    <Badge value="2" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.4.2"/>
                </p>
                <p>
                    <Badge value="3" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.4.3"/>
                </p>
                <p>
                    <Badge value="4" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.4.4"/>
                </p>
                <p>
                    <Badge value="5" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.4.5"/>
                </p>
            </div>
            <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                <Image src={i02} alt={i02} width="350" preview imageClassName="responsive-img"/>
            </div>
        </div>)}

        {activeIndex === 5 && (<div className="grid">
            <div className="col-12 md:col-12 lg:col-8">
                <p>
                    <Badge value="1" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.5.1"/>
                </p>
                <p>
                    <Badge value="2" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.5.2"/>
                </p>
                <p>
                    <Badge value="3" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.4.3"/>
                </p>
                <p>
                    <Badge value="4" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.4.1"/>
                </p>
                <p>
                    <Badge value="5" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.4.2"/>
                </p>
                <p>
                    <Badge value="6" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.5.6"/>
                </p>
            </div>
            <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                <Image src={i03} alt={i03} width="350" preview imageClassName="responsive-img"/>
            </div>
        </div>)}

        {activeIndex === 6 && (<div className="grid">
            <div className="col-12 md:col-12 lg:col-8">
                <p>
                    <Badge value="1" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.6.1"/>
                </p>
                <p>
                    <Badge value="2" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.6.2"/>
                </p>
                <p>
                    <Badge value="3" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.6.3"/>
                </p>
                <p>
                    <Badge value="4" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.6.4"/>
                </p>
                <p>
                    <Badge value="5" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.6.5"/>
                </p>
            </div>
            <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                <Image src={i04} alt={i04} width="350" preview imageClassName="responsive-img"/>
            </div>
        </div>)}

    </>
}

export default OverviewDeveloper;