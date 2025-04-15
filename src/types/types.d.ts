type Frequency = "yearly" | "quarterly" | "monthly" | "fortnightly" | "weekly";

interface ConnectionName {
  displayName: string;
}

interface Connection {
  userDefined: [];
  resourceName?: string;
  names: [ConnectionName];
  // https://developers.google.com/people/api/rest/v1/people
  // https://en.wikipedia.org/wiki/HTTP_ETag
  etag: string;
}

interface Person {
  // Unique ID is pulled from the Google API
  resourceName: string;
  // etag is pulled from the Google API
  etag: string;
  // Person's name
  name: string;
  // Desired check-in frequency
  targetCheckinFrequency: null | Frequency;
  // Last check-in date
  lastCheckin: null | Date;
  // Whether the checkin is overdue
  isCheckinOverdue: boolean;
  // Diff between checkin and now, in days. Can be negative (if on track) or positive (if overdue).
  diff: number;
  // By how much check-in is overdue, in % of the desired check-in frequency. 0 if the check-in is on track.
  overdueRatio: number;
  // Raw value for userDefined in incoming Google API objects of type connections
  userDefinedRaw: any
}
// Example:
// {
//   "resourceName": "people/c439789064886940822",
//   "name": "Andrea Fisher",
//   "isCheckinOverdue": true,
//   "diff": 6,
//   "targetCheckinFrequency": "monthly",
//   "lastCheckin": "2025-01-01T00:00:00.000Z",
//   "overdueRatio": 20
// }
