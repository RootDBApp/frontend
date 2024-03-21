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

const AncestorSizeProvider: React.FC<{
    children: React.ReactElement | React.ReactElement[],
    widthPropName?: string,
    heightPropName?: string,
    ancestorSelector?: string,
}> = ({
          children,
          widthPropName,
          heightPropName,
          ancestorSelector,
      }) => {
    const elemRef = React.useRef<HTMLDivElement>(null);
    const [width, setWidth] = React.useState<number>(window.innerWidth);
    const [height, setHeight] = React.useState<number>();
    const [childProps, setChildProps] = React.useState<object>(widthPropName ? {[widthPropName]: window.innerWidth} : {});
    const [ancestor, setAncestor] = React.useState<string | undefined>(ancestorSelector);
    const [elementToObserve, setElementToObserve] = React.useState<any>();

    React.useEffect(() => {
        setAncestor(ancestorSelector);
    }, [ancestorSelector]);

    React.useEffect(() => {

        if (elemRef.current) {
            if (ancestor) {
                setElementToObserve(elemRef.current.closest(ancestor));
            } else if (elemRef.current.parentElement) {

                setElementToObserve(elemRef.current.parentElement);
            }
        }

    }, [elemRef, ancestor]);

    React.useEffect(() => {
        if (elementToObserve) {

            const resizeObserver = new ResizeObserver((event) => {

                if (widthPropName) {
                    setWidth(elementToObserve.offsetParent ? event[0].contentBoxSize[0].inlineSize : window.innerWidth)
                }
                if (heightPropName) {
                    setHeight(event[0].contentBoxSize[0].blockSize)
                }
            });

            resizeObserver.observe(elementToObserve);

            return () => resizeObserver.unobserve(elementToObserve);
        } else {

            if (widthPropName) {
                setWidth(window.innerWidth);
            }
        }
    }, [elementToObserve, widthPropName, heightPropName]);

    React.useEffect(() => {
        let props = {};
        if (widthPropName) {
            props = {...props, [widthPropName]: width};
        }
        if (heightPropName) {
            props = {...props, [heightPropName]: height};
        }
        setChildProps(props);
    }, [width, height, widthPropName, heightPropName]);

    return (
        <>
            <div ref={elemRef} className="size-provider hidden"/>
            {React.Children.map(
                children,
                (child) => React.cloneElement(child, childProps)
            )}
        </>
    )
};

export default AncestorSizeProvider;