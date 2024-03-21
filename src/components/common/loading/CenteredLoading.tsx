import * as React from 'react';

const CenteredLoading: React.FC<{size?: number}> = ({size}) => (

    <div className="centered-loader">
        <i className="pi pi-spin pi-spinner" style={size ? {'fontSize': `${size}rem`} : {}}/>
    </div>
);

export default CenteredLoading;
