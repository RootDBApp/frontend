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

import hljs                      from 'highlight.js/lib/core';
import sql                       from 'highlight.js/lib/languages/sql';
import "highlight.js/styles/github-dark.css";
import { Badge }                 from "primereact/badge";
import { Image }                 from "primereact/image";
import { Divider }               from "primereact/divider";
import * as React                from "react";
import { Trans, useTranslation } from "react-i18next";

import i01 from "../../images/help/configure_connector/01.jpg"
import i02 from "../../images/help/configure_connector/02.jpg"

const ConfigureConnector = (): React.ReactElement => {

    const {t} = useTranslation('help');

    React.useEffect(() => {
        hljs.registerLanguage('sql', sql);
        hljs.highlightAll();
    }, []);

    return (
        <>
            <Divider layout="horizontal" align="left" type="solid">
                <i className="pi pi-info-circle mr-2"></i>{t('help:cards.configure_connector.to_know.title').toString()}
            </Divider>
            <div className="grid">
                <div className="col-12 md:col-12 lg:col-12">
                    <p>
                        <Trans i18nKey="help:cards.configure_connector.to_know.1"/>
                        <br/>
                        <Trans i18nKey="help:cards.configure_connector.to_know.2"/>
                    </p>
                </div>
            </div>

            <Divider layout="horizontal" align="left" type="solid">
                {t('help:cards.configure_connector.setup_access.title').toString()}
            </Divider>
            <div className="grid">
                <div className="col-12 md:col-12 lg:col-8">
                    <p>
                        <Badge value="1" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.configure_connector.setup_access.1"/>
                    </p>
                    <p>
                        <Badge value="2" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.configure_connector.setup_access.2"/>
                    </p>
                </div>
                <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                    <Image src={i01} alt={i01} width="350" preview imageClassName="responsive-img"/>
                </div>
            </div>


            <Divider layout="horizontal" align="left">
                {t('help:cards.configure_connector.connector_configuration.title').toString()}
            </Divider>
            <div className="grid">
                <div className="col-12 md:col-10 lg:col-8">
                    <h4>{t('help:cards.configure_connector.connector_configuration.1').toString()}</h4>
                    <p>
                        <Trans i18nKey="help:cards.configure_connector.connector_configuration.2"/>
                    </p>
                    <pre>
                        <code className="language-sql text-xs">
{`GRANT USAGE ON <your_db_name>.* TO <db_user_name>@<ip_of_api> IDENTIFIED BY '<a_password>';
GRANT SELECT, SHOW VIEW, EXECUTE ON <your_db_name>.* TO <db_user_name>@<ip_of_api>`}
                        </code>
                    </pre>
                    <p>
                        <Badge value="1" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.configure_connector.connector_configuration.3"/>
                        <br/>
                        <Trans i18nKey="help:cards.configure_connector.connector_configuration.3_1">
                            As a reference you can read the <a className="help-link "
                                                               href="https://mariadb.com/kb/en/configuring-mariadb-for-remote-client-access/"
                                                               target="_blank"
                                                               rel="noreferrer">
                            documentation for MariaDB.
                            <i className="pi pi-external-link ml-2"></i>
                        </a>
                        </Trans>
                    </p>
                    <h4>{t('help:cards.configure_connector.connector_configuration.4').toString()}</h4>
                    <p>
                        <Badge value="2" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.configure_connector.connector_configuration.5"/>
                    </p>
                    <p>
                        <Badge value="3" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.configure_connector.connector_configuration.6"/>
                    </p>

                </div>
                <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                    <Image src={i02} alt={i02} width="350" preview imageClassName="responsive-img"/>
                </div>
            </div>
        </>
    )

}

export default ConfigureConnector;