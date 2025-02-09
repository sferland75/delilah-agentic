export interface TableRow {
    [key: string]: string;
}

export interface TableData {
    headers: string[];
    rows: TableRow[];
    rowCount: number;
}
