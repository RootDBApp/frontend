import * as React from "react";

import ParameterInputsList from "./ParameterInputsList";

const ReportParameters = (): React.ReactElement => {

    return (
        <div className="flex flex-column tab-content">
            <ParameterInputsList/>
        </div>
    );
}

export default ReportParameters;