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

import * as React from 'react';

const FullScreenDialog: React.FC<{
    children: React.ReactElement | React.ReactElement[],
    onClose: Function,
    opened: boolean,
}> = (
    {
        children,
        onClose,
        opened,
    }
): React.ReactElement => {

    const [classNameDiv, setClassNameDiv] = React.useState<string>('before-expand-vertically-horizontally');


    // Handle shortcuts
    //
    React.useEffect(() => {

        function handleRunShortcut(event: KeyboardEvent): void {

            const {
                code,
            } = event;

            // ESC
            if (code === 'Escape') {

                event.preventDefault();
                if (onClose) {
                    onClose()
                }
            }
        }

        // Bind the Event listener
        document.addEventListener("keydown", handleRunShortcut);
        return () => {

            // Unbind the event listener on clean up
            document.removeEventListener("keydown", handleRunShortcut);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {

        if (opened) {

            setClassNameDiv('expand-vertically-horizontally');
        } else {

            setClassNameDiv('before-expand-vertically-horizontally');
        }
    }, [opened]);

    return <div
        className={classNameDiv}
    >
        {children}
    </div>
}
export default FullScreenDialog;