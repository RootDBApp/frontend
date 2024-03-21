import { Skeleton } from "primereact/skeleton";
import * as React   from 'react';

const GraphSkeleton: React.FC<{animation?: boolean}> = ({ animation = false }): React.ReactElement => {

    return (
        <div className="graphSkeleton flex align-items-end justify-content-center m-auto" style={{height: '450px'}}>
            <Skeleton animation={animation ? 'wave' : 'none'} width="20%" height="50%" className="mr-2"/>
            <Skeleton animation={animation ? 'wave' : 'none'} width="20%" height="80%" className="mr-2"/>
            <Skeleton animation={animation ? 'wave' : 'none'} width="20%" height="30%" className="mr-2"/>
            <Skeleton animation={animation ? 'wave' : 'none'} width="20%" height="60%"/>
        </div>
    )
}

export default GraphSkeleton;