type Frequency = "yearly" | "quarterly" | "monthly" | "fortnightly" | "weekly";

interface ConnectionName {
  displayName: string;
}

interface Connection {
  userDefined: [];
  resourceName?: string;
  names: [ConnectionName];
}

interface Person {
  // Unique ID puled from the Google API
  resourceName: string;
  // Person's name
  name: string;
  // Desired check-in frequency
  targetCheckinFrequency: Frequency;
  // Last check-in date
  lastCheckin: Date;
  // Whether the checkin is overdue
  isCheckinOverdue: boolean;
  // Diff between checkin and now, in days. Can be negative (if on track) or positive (if overdue).
  diff: number;
  // By how much check-in is overdue, in % of the desired check-in frequency. 0 if the check-in is on track.
  overdueRatio: number;
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
