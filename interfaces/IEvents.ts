export interface IRaidData {
    details: string,
    raidsList: IRaid[

    ],
    credit: string
};

export interface IRaid {
    name: string,
    details: string[],
    startTime: string,
    endTime: any
};