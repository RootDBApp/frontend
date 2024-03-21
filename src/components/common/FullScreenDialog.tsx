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