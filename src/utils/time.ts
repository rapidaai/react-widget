import moment from "moment";

export function toHumanReadableRelativeTimeFromDate(date: Date): string {
  return moment(date.toUTCString()).fromNow();
}
