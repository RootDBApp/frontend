import * as React from 'react';

const TopRightLoading: React.FC<{ size?: number }> = ({size}) => (

    <div className="top-right-loader">
        <i className="pi pi-spin pi-spinner" style={size ? {'fontSize': `${size}rem`} : {}}/>
    </div>
);

export default TopRightLoading;
