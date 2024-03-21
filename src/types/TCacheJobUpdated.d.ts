type TCacheJobUpdated = {
    id: number,
    running: boolean,
    last_run: string | null,
    last_run_duration: numberg | null,
    last_num_parameter_sets: numberg | null,
    last_cache_size: string,
};
export = TCacheJobUpdated;