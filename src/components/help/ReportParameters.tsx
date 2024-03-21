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
import { Divider }               from "primereact/divider";
import { Badge }                 from "primereact/badge";
import { Image }                 from "primereact/image";
import * as React                from "react";
import { Trans, useTranslation } from "react-i18next";

import i01 from "../../images/help/report_parameters/01.jpg"
import i02 from "../../images/help/report_parameters/02.jpg"
import i03 from "../../images/help/report_parameters/03.jpg"
import i04 from "../../images/help/report_parameters/04.jpg"
import i05 from "../../images/help/report_parameters/05.jpg";
import i06 from "../../images/help/report_parameters/06.jpg";

const ReportParameters: React.FC = (): React.ReactElement => {

    const {t} = useTranslation('help');

    React.useEffect(() => {
        hljs.registerLanguage('sql', sql);
        hljs.highlightAll();
    }, []);

    return (
        <>
            <Divider layout="horizontal" align="left" type="solid">
                <i className="pi pi-info-circle mr-2"></i>{t('help:cards.report_parameters.to_know.title').toString()}
            </Divider>
            <div className="grid">
                <div className="col-12 md:col-12 lg:col-12">
                    <p>
                        <Trans i18nKey="help:cards.report_parameters.to_know.1"/><br/>
                        <Trans i18nKey="help:cards.report_parameters.to_know.2"/><br/>
                        <Trans i18nKey="help:cards.report_parameters.to_know.3"/>
                    </p>
                </div>
            </div>

            <Divider layout="horizontal" align="left" type="solid">
                {t('help:cards.report_parameters.input_parameters.title').toString()}
            </Divider>
            <div className="grid">
                <div className="col-12 md:col-12 lg:col-8">
                    <p>
                        <Badge value="1" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.report_parameters.input_parameters.1"/>
                    </p>
                    <p>
                        <Badge value="2" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.report_parameters.input_parameters.2"/>
                    </p>
                    <p>
                        <Badge value="3" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.report_parameters.input_parameters.3"/>
                    </p>
                    <p>
                        <Badge value="4" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.report_parameters.input_parameters.4"/>
                    </p>
                    <p>
                        <Badge value="5" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.report_parameters.input_parameters.5"/>
                    </p>
                    <Badge value="6" className="mr-2" size="normal"/>
                    <Trans i18nKey="help:cards.report_parameters.input_parameters.6"/>
                    <p>
                        <Badge value="7" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.report_parameters.input_parameters.7"/>
                    </p>
                    <p>
                        <Badge value="8" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.report_parameters.input_parameters.8"/>
                    </p>
                    <p>
                        <Badge value="9" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.report_parameters.input_parameters.9"/>
                    </p>
                </div>
                <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                    <Image src={i01} alt={i01} width="350" preview imageClassName="responsive-img"/>
                </div>
            </div>

            <Divider layout="horizontal" align="left" type="solid">
                {t('help:cards.report_parameters.access_setup_report_parameters.title').toString()}
            </Divider>
            <div className="grid">
                <div className="col-12 md:col-12 lg:col-8">
                    <p>
                        <Badge value="1" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.report_parameters.access_setup_report_parameters.1"/>
                    </p>
                    <p>
                        <Badge value="2" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.report_parameters.access_setup_report_parameters.2"/>
                    </p>
                </div>
                <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                    <Image src={i02} alt={i02} width="350" preview imageClassName="responsive-img"/>
                </div>
            </div>

            <Divider layout="horizontal" align="left" type="solid">
                {t('help:cards.report_parameters.add_report_parameters.title').toString()}
            </Divider>
            <div className="grid">
                <div className="col-12 md:col-12 lg:col-8">
                    <p>
                        <Badge value="1" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.report_parameters.add_report_parameters.1"/>
                    </p>
                    <p>
                        <Badge value="2" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.report_parameters.add_report_parameters.2"/>
                    </p>
                    <p>
                        <Badge value="3" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.report_parameters.add_report_parameters.3"/>
                    </p>
                    <p>
                        <Badge value="4" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.report_parameters.add_report_parameters.4"/>
                    </p>
                    <p>
                        <Badge value="5" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.report_parameters.add_report_parameters.5"/>
                    </p>
                    <p>
                        <Badge value="6" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.report_parameters.add_report_parameters.6"/>
                    </p>
                </div>
                <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                    <Image src={i03} alt={i03} width="350" preview imageClassName="responsive-img"/>
                </div>
            </div>

            <Divider layout="horizontal" align="left" type="solid">
                {t('help:cards.report_parameters.usage_in_sql.title').toString()}
            </Divider>
            <div className="grid">
                <div className="col-12 md:col-12 lg:col-12">
                    <p>
                        <Trans i18nKey="help:cards.report_parameters.usage_in_sql.1"/>
                    </p>
                    <Trans i18nKey="help:cards.report_parameters.usage_in_sql.2"/><br/>
                    <pre>
                        <code className="language-sql text-xs">
{`-- In the initialization queries, which run before the main report's query :
IF @aVariableName
    THEN
      SET @aVariableToSet = (SELECT something FROM table);
    ELSE
      SET @aVariableToSet = (SELECT another_thing FROM another_table);
ENDIF;

-- In the main report's query :
SELECT * FROM your_table WHERE a_column = '@aVariableName';`}
                        </code>
                    </pre>
                    <Trans i18nKey="help:cards.report_parameters.usage_in_sql.3"/><br/>
                    <pre>
                        <code className="language-sql text-xs">
{`-- Select rows from a tables matching values selected by the user.
SELECT * FROM your_table WHERE find_in_set(a_column, @aVariableName)

-- Select rows from a tables matching values selected by the user _or_ do not use this parameter and return all rows.
SELECT * FROM your_table WHERE (@aVariableName = '' OR find_in_set(a_column, @aVariableName))`}
                        </code>
                    </pre>
                </div>
            </div>

            <Divider layout="horizontal" align="left" type="solid">
                {t('help:cards.report_parameters.auto_completion_title.title').toString()}
            </Divider>
            <div className="grid">
                <div className="col-12 md:col-12 lg:col-8">
                    <p>
                        <Badge value="1" className="mr-2" size="normal"/>
                        <Badge value="2" className="mr-2" size="normal"/>
                        <Trans i18nKey="help:cards.report_parameters.auto_completion_title.12"/>
                    </p>
                </div>
                <div className="col-12 md:col-12 lg:col-4 flex align-items-center justify-content-center">
                    <Image src={i05} alt={i05} width="350" preview imageClassName="responsive-img"/>
                </div>
            </div>


            <div className="grid">
                <div className="col-12 md:col-12 lg:col-6">
                    <Divider layout="horizontal" align="left" type="solid">
                        {t('help:cards.report_parameters.auto_completion.title').toString()}
                    </Divider>
                    <div className="col-12 md:col-12 lg:col-12 flex align-items-center justify-content-center">
                        <Image src={i04} alt={i04} width="350" preview imageClassName="responsive-img"/>
                    </div>
                </div>

                <div className="col-12 md:col-12 lg:col-6">
                    <Divider layout="horizontal" align="left" type="solid">
                        {t('help:cards.report_parameters.report_parameters_value_display.title').toString()}
                    </Divider>
                    <div className=" flex align-items-center justify-content-center">
                        <Image src={i06} alt={i06} width="350" preview imageClassName="responsive-img"/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReportParameters;