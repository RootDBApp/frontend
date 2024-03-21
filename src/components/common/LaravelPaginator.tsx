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

import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import * as React                              from 'react';

import TLaravelPagination    from "../../types/TLaravelPagination";
import { ICallbackPaginate } from "../../types/ICallBacks";

const LaravelPaginator: React.FC<{
    paginateCallback: ICallbackPaginate,
    pagination?: TLaravelPagination
}> = ({
          paginateCallback,
          pagination
      }) => {

    if (pagination === undefined) {

        return <></>;
    }

    return (
        <Paginator
            style={{border: 'none'}}
            first={pagination.from - 1}
            rows={pagination.per_page}
            totalRecords={pagination.total}
            onPageChange={
                (event: PaginatorPageChangeEvent) => {

                    paginateCallback(event.page + 1);
                }
            }
        />
    );
};

export default LaravelPaginator;