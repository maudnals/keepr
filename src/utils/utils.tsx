export const inDays = {
  yearly: 365,
  quarterly: 90,
  monthly: 30,
  fortnightly: 15,
  weekly: 7,
};

export const keeprPpties = {
  lastCheckin: {
    name: "lastCheckin",
    validateAndParse: function (lastCheckinDateValue: string) {
      const parsedDate = Date.parse(lastCheckinDateValue);
      if (Number.isNaN(parsedDate)) {
        return null;
      } else {
        return new Date(parsedDate);
      }
    },
  },
  targetCheckinFrequency: {
    name: "targetCheckinFrequency",
    validateAndParse: function (targetCheckinFrequencyValue: string) {
      if (
        !["yearly", "monthly", "fortnightly", "weekly"].includes(
          targetCheckinFrequencyValue
        )
      ) {
        return null;
      } else {
        return targetCheckinFrequencyValue;
      }
    },
  },
};

export const keeprPptiesNames = Object.keys(keeprPpties);
