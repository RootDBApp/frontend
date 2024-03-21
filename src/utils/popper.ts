import * as React    from 'react';

export function generateGetBoundingClientRect(x = 0, y = 0) {
    return () => ({
        width: 0,
        height: 0,
        top: y,
        right: x,
        bottom: y,
        left: x,
    });
}

export function useOutsideClickHandler(
    popperElement: HTMLElement | null,
    onOutsideClick: CallableFunction,
) {
    React.useEffect(() => {

        function handleClickOutside(event: Event) {
            if (!popperElement?.contains(event.target as Node)) {
                onOutsideClick();
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popperElement, onOutsideClick]);
}