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

export const KEEPR_PPTIES = {
  lastCheckin: "lastCheckin",
  targetCheckinFrequency: "targetCheckinFrequency",
};

const keeprPptyValues = Object.values(KEEPR_PPTIES);

export const validatorsParsers = {
  [KEEPR_PPTIES.lastCheckin]: function (
    lastCheckinValue: string,
    resourceName: string
  ) {
    const parsedDate = Date.parse(lastCheckinValue);
    if (Number.isNaN(parsedDate)) {
      throw new Error(
        `Error during data pulling for ${resourceName}: lastCheckin '${lastCheckinValue}' is invalid.`
      );
    } else {
      return new Date(parsedDate);
    }
  },
  [KEEPR_PPTIES.targetCheckinFrequency]: function (
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
  let diff = null;
  let isCheckinOverdue = false;
  let overdueRatio = null;

  if (person.targetCheckinFrequency && person.lastCheckin) {
    const gapInMs = new Date(now).getTime() - person.lastCheckin.getTime();
    // Use Math.floor to be lax on checkin (laxer than Math.ceiling)
    const gapInDays = Math.floor(gapInMs / (24 * 3600 * 1000));
    const targetGapInDays = frequencyToDays[person.targetCheckinFrequency];
    diff = Math.abs(gapInDays - targetGapInDays);
    isCheckinOverdue = gapInDays > targetGapInDays;
    overdueRatio = Math.round(100 / (targetGapInDays / diff));
  }

  return {
    isCheckinOverdue,
    diff,
    overdueRatio,
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
  if (!connection.resourceName || !connection.names) {
    return null;
  }
  let person: Person = {
    resourceName: connection.resourceName,
    etag: connection.etag,
    name: connection.names[0]
      ? connection?.names[0]?.displayName
      : "placeholder",
    isCheckinOverdue: false,
    diff: 0,
    // TODO order: place unset at the bottom? alo, should we really reorder upon edit? could be confusing
    targetCheckinFrequency: null,
    lastCheckin: null,
    overdueRatio: 0,
    userDefinedRaw: connection.userDefined,
  };
  if (connection.userDefined) {
    connection.userDefined.forEach((entry) => {
      const { key, value } = entry;
      if (keeprPptyValues.includes(value)) {
        const parsed = validatorsParsers[value](key, person.resourceName);
        person = { ...person, [value]: parsed };
      }
    });
  }
  const overdueDetails = getOverdueDetails(now, person);
  person = { ...person, ...overdueDetails };
  return person;
}

export function remainingDaysUntilCheckinFormatter(diff: number) {
  return `${diff} ${numberOfDaysFormatter(diff)}`;
}

export function overdueRatioFormatter(overdueRatio: number, diff: number) {
  let emoji = "";
  if (overdueRatio > 100) {
    emoji = "😓";
  }
  return `${overdueRatio}% (${diff} ${numberOfDaysFormatter(diff)}) ${emoji} `;
}

export function numberOfDaysFormatter(numberOfDays: number) {
  const isDaysPlural = (diff: number) => Math.abs(diff) > 1;
  return `day${isDaysPlural(numberOfDays) ? "s" : ""}`;
}
