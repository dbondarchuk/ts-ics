import set from "lodash/set";

import {
  replaceTimezoneDaylightRegex,
  replaceTimezoneStandardRegex,
} from "@/constants";
import {
  VTIMEZONE_PROP_KEYS,
  VTIMEZONE_PROP_TO_OBJECT_KEYS,
  type VTimezonePropKey,
} from "@/constants/keys/timezoneProp";
import {
  VTimezoneProp,
  VTimezonePropType,
  zVTimezoneProp,
} from "@/types/timezone";

import { icsDateTimeToDateTime } from "./date";
import { icsRecurrenceRuleToObject } from "./recurrenceRule";
import { icsTimeStampToObject } from "./timeStamp";
import { getLine } from "./utils/line";
import { splitLines } from "./utils/splitLines";

export const icsTimezonePropToObject = (
  rawTimezonePropString: string,
  type?: VTimezonePropType
): VTimezoneProp => {
  const timezonePropString = rawTimezonePropString
    .replace(replaceTimezoneStandardRegex, "")
    .replace(replaceTimezoneDaylightRegex, "");

  const lines = splitLines(VTIMEZONE_PROP_KEYS, timezonePropString);

  const timezoneProp = { type: type || "STANDARD" };

  lines.forEach((line) => {
    const { property, options, value } = getLine<VTimezonePropKey>(line);

    const objectKey = VTIMEZONE_PROP_TO_OBJECT_KEYS[property];

    if (!objectKey) return;

    if (objectKey === "start") {
      set(timezoneProp, objectKey, icsDateTimeToDateTime(value));
      return;
    }

    if (objectKey === "recurrenceRule") {
      set(timezoneProp, objectKey, icsRecurrenceRuleToObject(value));
      return;
    }

    if (objectKey === "recurrenceDate") {
      set(timezoneProp, objectKey, icsTimeStampToObject(value, options));
      return;
    }

    set(timezoneProp, objectKey, value);
  });

  return timezoneProp as VTimezoneProp;
};

export const parseIcsTimezoneProp = (
  rawTimezonePropString: string,
  type?: VTimezonePropType
): VTimezoneProp =>
  zVTimezoneProp.parse(icsTimezonePropToObject(rawTimezonePropString, type));
