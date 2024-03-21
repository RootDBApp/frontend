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