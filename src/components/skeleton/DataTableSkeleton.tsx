import * as React    from 'react';
import { DataTable } from "primereact/datatable";
import { Column }                  from "primereact/column";
import { Skeleton } from "primereact/skeleton";

const DataTableSkeleton: React.FC<{ animation?: boolean}> = ({ animation= false }): React.ReactElement => {

    const products = Array.from({length: 10});

    const bodyTemplate = () => {

        return <Skeleton animation={animation ? 'wave' : 'none'} />
    }

    return (
        // @ts-ignore - primereact-v9
        <DataTable value={products} className="p-datatable-striped">
            <Column field="code" header="Col 1" style={{width: '25%'}} body={bodyTemplate}/>
            <Column field="name" header="Col 2" style={{width: '25%'}} body={bodyTemplate}/>
            <Column field="category" header="Col 3" style={{width: '25%'}} body={bodyTemplate}/>
            <Column field="quantity" header="Col 4" style={{width: '25%'}} body={bodyTemplate}/>
        </DataTable>
    )
}

export default DataTableSkeleton;