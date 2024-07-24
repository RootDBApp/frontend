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

export const getElementContentSize = (element: HTMLElement | null | undefined): {
    width: number,
    height: number,
    paddingX: number,
    paddingY: number,
    borderX: number,
    borderY: number,
    marginX: number,
    marginY: number,
} | undefined => {
    if (!element) return undefined;

    const cs = getComputedStyle(element);

    const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

    const borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
    const borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

    const marginX = parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
    const marginY = parseFloat(cs.marginTop) + parseFloat(cs.marginBottom);

    return {
        width: element.offsetWidth - paddingX - borderX,
        height: element.offsetHeight - paddingY - borderY,
        paddingX,
        paddingY,
        borderX,
        borderY,
        marginX,
        marginY
    }
}

export const getElementBackgroundColor = (element: HTMLElement | null | undefined): string | undefined => {
    if (!element) return undefined;

    const cs = getComputedStyle(element);
    console.debug('computed style', cs);

    return cs.backgroundColor;
}