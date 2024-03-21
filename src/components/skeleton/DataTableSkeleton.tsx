/*
 * This file is part of RootDB.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * AUTHORS
 * PORQUET Sébastien <sebastien.porquet@ijaz.fr>
 * ROBIN Brice <brice@robri.net>
 */

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