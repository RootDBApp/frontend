type TDataViewInstance = {
    id: number, // report.dataview.id
    loading: boolean,
    results: Array<any>,
    results_from_cache: boolean,
    showQuery: boolean,
    waitingData: boolean,
    end?: number, // Hold end timestamp when query finished to run
    errors?: Array<string>,
    start?: number, // Hold start timestamp when query start to run
    elapsedTime?: number // elapsed time coming from the api
}

export = TDataViewInstance;