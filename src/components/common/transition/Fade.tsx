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

import Transition           from 'react-transition-group/Transition';
import React, { ReactNode } from "react";

const duration = 300;

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
    width: 0,
    height: 0,
}

const transitionStyles: any = {
    entering: {opacity: 1, width: '100%', height: '100%'},
    entered: {opacity: 1, width: '100%', height: '100%'},
};

const Fade: React.FC<{ in: boolean, children: ReactNode, className?: string }> = ({in: inProp, children, className}) => (
    <Transition in={inProp} timeout={duration}>
        {(state) => (
            <div
                className={className}
                style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                }}
            >
                {children}
            </div>
        )}
    </Transition>
);

export default Fade;