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