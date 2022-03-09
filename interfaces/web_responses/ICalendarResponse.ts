export interface ICalendarResponse {
    kind: string,
    etag: string,
    summary: string,
    updated: string,
    timeZone: string,
    accessRole: string,
    defaultReminders: [ ],
    nextSyncToken: string,
    items: ICalendarItems[]
}

export interface ICalendarItems {
    kind: string,
    etag: string,
    id: string,
    status: string,
    htmlLink: string,
    created: string,
    updated: string,
    summary: string,
    description: string,
    creator: {
        email: string
    },
        organizer: {
            email: string,
            displayName: string,
            self: boolean
    },
    start: {
        dateTime: string,
        timeZone: string
    },
    end: {
        dateTime: string,
        timeZone: string
    },
    iCalUID: string,
    sequence: number,
    eventType: string
}
