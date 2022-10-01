type Year = `${number}${number}${number}${number}`
type Month = `${number}${number}`
type Day = `${number}${number}`
type Hours = `${number}${number}`
type Minutes = `${number}${number}`
type Seconds = `${number}${number}`
type Milliseconds = `${number}${number}${number}`

/** Represent a string like `2021-01-08` */
type DateISODate = `${Year}-${Month}-${Day}`

/** Represent a string like `14:42:34.678` */
type DateISOTime = `${Hours}:${Minutes}:${Seconds}.${Milliseconds}`

/** Represent a string like `2021-01-08T14:42:34.678Z` (format: ISO 8601) */
export type DateISO = `${DateISODate}T${DateISOTime}Z`
