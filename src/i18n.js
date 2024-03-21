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

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import menu_fr from './translations/fr/menu.json';
import common_fr from './translations/fr/common.json';
import report_fr from './translations/fr/report.json';
import settings_fr from './translations/fr/settings.json';
import help_fr from './translations/fr/help.json'
import widget_fr from './translations/fr/widget.json'

import menu_en from './translations/en/menu.json';
import common_en from './translations/en/common.json';
import report_en from './translations/en/report.json';
import settings_en from './translations/en/settings.json';
import widget_en from './translations/en/widget.json'
import help_en from './translations/en/help.json'


// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        fallbackLng: 'en',
        Lng: 'en',
        debug: false,

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },

        detection: {
            lookupLocalStorage: 'lang',
        },

        resources: {
            en: {
                common: common_en,
                help: help_en,
                menu: menu_en,
                report: report_en,
                settings: settings_en,
                widget: widget_en
            },
            fr: {
                common: common_fr,
                help: help_fr,
                menu: menu_fr,
                report: report_fr,
                settings: settings_fr,
                widget: widget_fr
            },
        },
    });


export default i18n;