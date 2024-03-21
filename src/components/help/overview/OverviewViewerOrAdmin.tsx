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
import i01                        from "../../../images/quick_overview/interface_overview_viewer_or_admin_1.jpg"
import i02                        from "../../../images/quick_overview/interface_overview_viewer_or_admin_2.jpg"
import i03                        from "../../../images/quick_overview/interface_overview_viewer_or_admin_3.jpg"
import i04                        from "../../../images/quick_overview/interface_overview_viewer_or_admin_4.jpg"


const OverviewViewerOrAdmin: React.FC<{
    activeIndex: number,
    setItems: ICallbackOverviewItems
}> = ({activeIndex, setItems}): React.ReactElement => {

    const {t} = useTranslation('help');

    React.useEffect(() => {
        setItems([
            {
                label: t('help:quick_overview.viewer_or_admin.0.title').toString(),
            },
            {
                label: t('help:quick_overview.viewer_or_admin.1.title').toString(),
            },
            {
                label: t('help:quick_overview.viewer_or_admin.2.title').toString(),
            },
            {
                label: t('help:quick_overview.viewer_or_admin.3.title').toString(),
            },
            {
                label: t('help:quick_overview.viewer_or_admin.4.title').toString(),
            },
            {
                label: t('help:quick_overview.viewer_or_admin.5.title').toString(),
            }
        ]);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>
        {activeIndex === 0 && (
            <>
                <p>
                    <Trans i18nKey="help:quick_overview.viewer_or_admin.0.1"/>
                </p>
                <p>
                    <Trans i18nKey="help:quick_overview.viewer_or_admin.0.2"/>
                </p>
            </>
        )}

        {activeIndex === 1 && (
            <div className="grid">
                <div className="col-12">
                    <p>
                        <Trans i18nKey="help:quick_overview.viewer_or_admin.1.1"/>
                    </p>
                    <ul>
                        <li><Trans i18nKey="help:quick_overview.viewer_or_admin.1.2"/></li>
                        <li><Trans i18nKey="help:quick_overview.viewer_or_admin.1.3"/></li>
                    </ul>
                </div>
            </div>
        )}

        {activeIndex === 2 && (<div className="grid">
            <div className="col-12 md:col-12 lg:col-8">
                <Trans i18nKey="help:quick_overview.viewer_or_admin.2.0"/>
                <p>
                    <Badge value="1" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.viewer_or_admin.2.1"/>
                </p>
                <p>
                    <Badge value="2" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.viewer_or_admin.2.2"/>
                </p>
                <p>
                    <Badge value="3" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.viewer_or_admin.2.3"/>
                </p>
                <p>
                    <Badge value="3" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.viewer_or_admin.2.4"/>
                </p>
            </div>
            <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                <Image src={i01} alt={i01} width="350" preview imageClassName="responsive-img"/>
            </div>
        </div>)}

        {activeIndex === 3 && (<div className="grid">
            <div className="col-12 md:col-12 lg:col-8">
                <p>
                    <Badge value="1" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.viewer_or_admin.3.1"/>
                </p>
                <p>
                    <Badge value="2" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.viewer_or_admin.3.2"/>
                </p>
                <p>
                    <Badge value="3" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.viewer_or_admin.3.3"/>
                </p>
            </div>
            <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                <Image src={i02} alt={i02} width="350" preview imageClassName="responsive-img"/>
            </div>
        </div>)}

        {activeIndex === 4 && (<div className="grid">
            <div className="col-12 md:col-12 lg:col-8">
                <p>
                    <Badge value="1" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.4.3"/>
                </p>
                <p>
                    <Badge value="2" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.4.1"/>
                </p>
                <p>
                    <Badge value="3" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.dev.4.2"/>
                </p>
                <p>
                    <Badge value="4" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.viewer_or_admin.4.6"/>
                </p>
            </div>
            <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                <Image src={i03} alt={i03} width="350" preview imageClassName="responsive-img"/>
            </div>
        </div>)}

        {activeIndex === 5 && (<div className="grid">
            <div className="col-12 md:col-12 lg:col-8">
                <p>
                    <Badge value="1" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:quick_overview.viewer_or_admin.5.1"/>
                </p>
            </div>
            <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                <Image src={i04} alt={i04} width="350" preview imageClassName="responsive-img"/>
            </div>
        </div>)}
    </>
}

export default OverviewViewerOrAdmin;