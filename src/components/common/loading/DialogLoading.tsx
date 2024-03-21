import * as React from 'react';
import { Dialog } from "primereact/dialog";

import CenteredLoading from "./CenteredLoading";

const DialogLoading: React.FC = () => (

    <Dialog visible position="top" onHide={() => {
    }} resizable={false} draggable={false} closable={false}>
        <CenteredLoading/>
    </Dialog>
);

export default DialogLoading;
