import * as React from 'react';

export const useMobileLayout = (): boolean => {

    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 992);

    React.useEffect(() => {

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 992);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return isMobile;
}