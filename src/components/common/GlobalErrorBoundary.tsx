import React, { ErrorInfo } from 'react';

import CenteredError from "./loading/CenteredError";

export default class GlobalErrorBoundary extends React.Component<{}, { hasError: boolean }> {

    constructor(props: {}) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error: Error) {    // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {    // You can also log the error to an error reporting service
        // logErrorToMyService(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {    // You can render any custom fallback UI
            return <CenteredError/>;
        }
        // @ts-ignore - react-18 move
        return this.props.children;
    }
}