import * as React        from 'react';
import { createRoot }    from "react-dom/client";
import App               from './App';
import { BrowserRouter } from "react-router-dom";

import './i18n';


// @todo - to be removed when https://github.com/facebook/create-react-app/pull/9222 is closed.
// @todo - trans
if (process.env.NODE_ENV !== 'development') {

    console.debug = () => {
    }
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
);