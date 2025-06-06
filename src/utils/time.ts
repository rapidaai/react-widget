import moment from "moment";

export function toHumanReadableRelativeTimeFromDate(date: Date): string {
  return moment(date.toUTCString()).fromNow();
}

export function formatTimeToHHMMPM(date: Date): string {
  return moment(date).format("h:mm A");
}
