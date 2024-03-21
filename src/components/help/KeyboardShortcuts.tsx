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

import * as React                from "react";
import { Trans, useTranslation } from "react-i18next";
import { Column }                from "primereact/column";
import { DataTable }             from "primereact/datatable";
import { Button }                from "primereact/button";


const KeyboardShortcuts = (): React.ReactElement => {

    const {t} = useTranslation('help');

    const [allShortcuts] = React.useState<Array<Object>>([
        {
            "shortcut": <>
                <Button label="ALT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="SHIFT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="D" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
            </>,
            "context": <Trans i18nKey="help:cards.keyboard_shortcuts.15.context"/>,
            "action": <Trans i18nKey="help:cards.keyboard_shortcuts.15.action"/>
        },
        {
            "shortcut": <>
                <Button label="ALT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="SHIFT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="H" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
            </>,
            "context": <Trans i18nKey="help:cards.keyboard_shortcuts.1.context"/>,
            "action": <Trans i18nKey="help:cards.keyboard_shortcuts.1.action"/>
        },
        {
            "shortcut": <>
                <Button label="ALT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="SHIFT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="J" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
            </>,
            "context": <Trans i18nKey="help:cards.keyboard_shortcuts.2.context"/>,
            "action": <Trans i18nKey="help:cards.keyboard_shortcuts.2.action"/>
        },
        {
            "shortcut": <>
                <Button label="ALT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="MAJ" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="W" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
            </>,
            "context": <Trans i18nKey="help:cards.keyboard_shortcuts.13.context"/>,
            "action": <Trans i18nKey="help:cards.keyboard_shortcuts.13.action"/>
        },
        {
            "shortcut": <>
                <Button label="CTRL" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="ALT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="MAJ" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="W" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
            </>,
            "context": <Trans i18nKey="help:cards.keyboard_shortcuts.14.context"/>,
            "action": <Trans i18nKey="help:cards.keyboard_shortcuts.14.action"/>
        },
        {
            "shortcut": <>
                <Button label="ALT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="SHIFT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="V" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
            </>,
            "context": <Trans i18nKey="help:cards.keyboard_shortcuts.8.context"/>,
            "action": <Trans i18nKey="help:cards.keyboard_shortcuts.8.action"/>
        },
        {
            "shortcut": <>
                <Button label="ALT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="SHIFT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="R" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
            </>,
            "context": <Trans i18nKey="help:cards.keyboard_shortcuts.3.context"/>,
            "action": <Trans i18nKey="help:cards.keyboard_shortcuts.3.action"/>
        },
        {
            "shortcut": <>
                <Button label="ALT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="SHIFT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="I" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
            </>,
            "context": <Trans i18nKey="help:cards.keyboard_shortcuts.4.context"/>,
            "action": <Trans i18nKey="help:cards.keyboard_shortcuts.4.action"/>
        },
        {
            "shortcut": <>
                <Button label="ALT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="SHIFT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="C" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
            </>,
            "context": <Trans i18nKey="help:cards.keyboard_shortcuts.5.context"/>,
            "action": <Trans i18nKey="help:cards.keyboard_shortcuts.5.action"/>
        },
        {
            "shortcut": <>
                <Button label="ALT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="SHIFT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="Q" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
            </>,
            "context": <Trans i18nKey="help:cards.keyboard_shortcuts.6.context"/>,
            "action": <Trans i18nKey="help:cards.keyboard_shortcuts.6.action"/>
        },
        {
            "shortcut": <>
                <Button label="CTRL" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="ENTER" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
            </>,
            "context": <Trans i18nKey="help:cards.keyboard_shortcuts.7.context"/>,
            "action": <Trans i18nKey="help:cards.keyboard_shortcuts.7.action"/>
        },
        {
            "shortcut": <>
                <Button label="CTRL" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="ENTER" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
            </>,
            "context": <Trans i18nKey="help:cards.keyboard_shortcuts.9.context"/>,
            "action": <Trans i18nKey="help:cards.keyboard_shortcuts.9.action"/>
        },
        {
            "shortcut": <>
                <Button label="CTRL" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="D" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
            </>,
            "context": <Trans i18nKey="help:cards.keyboard_shortcuts.10.context"/>,
            "action": <Trans i18nKey="help:cards.keyboard_shortcuts.10.action"/>
        },
        {
            "shortcut": <>
                <Button label="CTRL" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="ENTER" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
            </>,
            "context": <Trans i18nKey="help:cards.keyboard_shortcuts.11.context"/>,
            "action": <Trans i18nKey="help:cards.keyboard_shortcuts.11.action"/>
        },
        {
            "shortcut": <>
                <Button label="CTRL" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="SHIFT" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
                <Button icon="pi pi-plus" className="mr-2 ml-2 p-button-rounded p-button-secondary p-button-text"/>
                <Button label="ENTER" className="p-button-raised p-button-secondary p-button-text p-button-shortcut"/>
            </>,
            "context": <Trans i18nKey="help:cards.keyboard_shortcuts.12.context"/>,
            "action": <Trans i18nKey="help:cards.keyboard_shortcuts.12.action"/>
        }
    ]);

    return (
        <>
            <div className="grid">
                <div className="col-12 md:col-12 lg:col-12">

                    <DataTable value={allShortcuts} responsiveLayout="scroll">
                        <Column field="shortcut" header={t('help:cards.keyboard_shortcuts.header.shortcut')}></Column>
                        <Column field="context" header={t('help:cards.keyboard_shortcuts.header.context')}></Column>
                        <Column field="action" header={t('help:cards.keyboard_shortcuts.header.action')}></Column>
                    </DataTable>

                </div>
            </div>

        </>
    )
}

export default KeyboardShortcuts;