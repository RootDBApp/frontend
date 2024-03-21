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