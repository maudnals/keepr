const frequencies = {
  yearly: "yearly",
  quarterly: "quarterly",
  monthly: "monthly",
  fortnightly: "fortnightly",
  weekly: "weekly",
};

const frequencyValues = Object.values(frequencies);

export const frequencyToDays = {
  [frequencies.yearly]: 365,
  [frequencies.quarterly]: 90,
  [frequencies.monthly]: 30,
  [frequencies.fortnightly]: 15,
  [frequencies.weekly]: 7,
};

// enum Frequencies {
//   yearly,
//   quarterly,
//   monthly,
//   fortnightly,
//   weekly,
// }

export const keeprPpties = {
  lastCheckin: "lastCheckin",
  targetCheckinFrequency: "targetCheckinFrequency",
};

const keeprPptyValues = Object.values(keeprPpties);

export const validatorsParsers = {
  [keeprPpties.lastCheckin]: function (
    lastCheckinDateValue: string,
    resourceName: string
  ) {
    const parsedDate = Date.parse(lastCheckinDateValue);
    if (Number.isNaN(parsedDate)) {
      throw new Error(
        `Error during data pulling for ${resourceName}: lastCheckinDate '${lastCheckinDateValue}' is invalid.`
      );
    } else {
      return new Date(parsedDate);
    }
  },
  [keeprPpties.targetCheckinFrequency]: function (
    targetCheckinFrequencyValue: Frequency,
    resourceName: string
  ) {
    if (!frequencyValues.includes(targetCheckinFrequencyValue)) {
      throw new Error(
        `Error during data pulling for ${resourceName}: targetCheckinFrequency '${targetCheckinFrequencyValue}' is invalid.`
      );
    } else {
      return targetCheckinFrequencyValue;
    }
  },
};

export function getOverdueDetails(now: number, person: Person) {
  const gapInMs = new Date(now).getTime() - person.lastCheckin.getTime();
  // Use Math.floor to be lax on checkin (laxer than Math.ceiling)
  const gapInDays = Math.floor(gapInMs / (24 * 3600 * 1000));
  const targetGapInDays = frequencyToDays[person.targetCheckinFrequency];
  const diff = Math.abs(gapInDays - targetGapInDays);
  return {
    isCheckinOverdue: gapInDays > targetGapInDays,
    diff: diff,
    overdueRatio: Math.round(100 / (targetGapInDays / diff)),
    // const x =
    // 0 days for 30 -> 0%
    // 15 days overdue for 30 -> 50%
    // 30 days overdue for 30 -> 100%
    // 60 days overdue for 30 -> 200%
  };
}

export function createPersonFromConnection(
  connection: Connection,
  now: number
) {
  if (
    !connection.userDefined ||
    !connection.resourceName ||
    !connection.names[0]?.displayName
  ) {
    return null;
  }
  let person: Person = {
    resourceName: connection.resourceName,
    name: connection.names[0].displayName,
    isCheckinOverdue: false,
    diff: 0,
    targetCheckinFrequency: "yearly",
    lastCheckin: new Date(),
    overdueRatio: 0,
  };
  connection.userDefined.forEach((entry) => {
    const { key, value } = entry;
    if (keeprPptyValues.includes(value)) {
      const parsed = validatorsParsers[value](key, person.resourceName);
      person = { ...person, [value]: parsed };
    }
  });
  const overdueDetails = getOverdueDetails(now, person);
  person = { ...person, ...overdueDetails };
  return person;
}
