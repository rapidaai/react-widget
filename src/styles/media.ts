import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toDate(timestamp: Timestamp): Date {
  // Extract seconds and nanos from gRPC Timestamp
  const seconds = timestamp.getSeconds();
  const nanos = timestamp.getNanos();

  // Calculate milliseconds since Unix epoch
  // const milliseconds = seconds * 1000 + Math.round(nanos / 1e6);

  // // Create Moment.js object from milliseconds
  // return moment.utc(milliseconds).toDate();

  // // Extract seconds and nanos from the gRPC timestamp
  // const { seconds, nanos } = timestamp;

  // Convert seconds to milliseconds
  const millisecondsFromSeconds = seconds * 1000;

  // Convert nanos to milliseconds
  const millisecondsFromNanos = nanos / 1000000;

  // Combine the two to get the total milliseconds
  const totalMilliseconds = millisecondsFromSeconds + millisecondsFromNanos;

  // Create a new Date object using the total milliseconds (interpreted as UTC)
  const utcDate = new Date(totalMilliseconds);

  // The Date object automatically handles conversion to local time
  return utcDate;
}

export function toHumanReadableRelativeTime(timestamp: Timestamp): string {
  return moment(toDate(timestamp).toUTCString()).fromNow();
}
export function daysAgoFromTimestamp(timestamp: Timestamp): number {
  const givenDate = moment(toDate(timestamp).toUTCString());
  const today = moment().utc();
  return today.diff(givenDate, "days");
}
export function toHumanReadableRelativeDay(timestamp: Timestamp): string {
  const daysAgo = daysAgoFromTimestamp(timestamp);
  if (daysAgo === 0) {
    return "today";
  } else if (daysAgo === 1) {
    return "yesterday";
  } else {
    return `${daysAgo} days ago`;
  }
}

export function getTimeFromDate(timestamp: Timestamp): string {
  const hours = toDate(timestamp).getHours().toString().padStart(2, "0");
  const minutes = toDate(timestamp).getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
