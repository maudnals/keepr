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
  targetCheckinFrequency: Frequency | null;
  // Last check-in date
  lastCheckin: Date | null;
  // Whether the checkin is overdue
  isCheckinOverdue: boolean;
  // Diff between checkin and now, in days. Can be negative (if on track) or positive (if overdue).
  diff: number;
  // By how much check-in is overdue, in % of the desired check-in frequency. 0 if the check-in is on track.
  overdueRatio: number;
  // Raw value for userDefined in incoming Google API objects of type connections
  userDefinedRaw: any
  // Notes for the check-in, if any
  checkinNotes: string | null;
}
// Example:
// {
//   "resourceName": "people/c7082907203174703430",
//   "notes": "Upcoming project with his dad",
//   "etag": "%Eg4BAgUHCQsWGScuNz0+PxoEAQIFByIMWlJhVGxJdmRlcGs9",
//   "name": "Paul S",
//   "isCheckinOverdue": true,
//   "diff": 29,
//   "targetCheckinFrequency": "weekly",
//   "lastCheckin": "2025-05-06T22:00:00.000Z",
//   "overdueRatio": 414,
//   "userDefinedRaw": [
//       {
//           "metadata": {
//               "primary": true,
//               "source": {
//                   "type": "CONTACT",
//                   "id": "624b8a930e48a146"
//               }
//           },
//           "key": "Wed May 07 2025",
//           "value": "lastCheckin"
//       },
//       {
//           "metadata": {
//               "source": {
//                   "type": "CONTACT",
//                   "id": "624b8a930e48a146"
//               }
//           },
//           "key": "weekly",
//           "value": "targetCheckinFrequency"
//       }
//   ]
// }