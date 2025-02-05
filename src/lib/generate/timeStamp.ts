import compact from "lodash/compact";

import { DateObject } from "@/types";

import { generateIcsDate, generateIcsDateTime } from "./date";
import { generateIcsLine } from "./utils/addLine";
import { generateIcsOptions } from "./utils/generateOptions";

export const generateIcsTimeStamp = (
  icsKey: string,
  dateObject: DateObject
) => {
  const value =
    dateObject.type === "DATE"
      ? generateIcsDate(dateObject.date)
      : generateIcsDateTime(dateObject.date);

  const options = generateIcsOptions(
    compact([
      dateObject.type && { key: "VALUE", value: dateObject.type },
      dateObject.timezone && { key: "TZID", value: dateObject.timezone },
    ])
  );

  return generateIcsLine(icsKey, value, options);
};
