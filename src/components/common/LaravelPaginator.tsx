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