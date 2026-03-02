import { formatTimeToHHMMPM, toHumanReadableRelativeTimeFromDate } from '@/utils/time';

describe('formatTimeToHHMMPM', () => {
  it('formats midnight as 12:00 AM', () => {
    const date = new Date(2024, 0, 1, 0, 0, 0);
    expect(formatTimeToHHMMPM(date)).toBe('12:00 AM');
  });

  it('formats noon as 12:00 PM', () => {
    const date = new Date(2024, 0, 1, 12, 0, 0);
    expect(formatTimeToHHMMPM(date)).toBe('12:00 PM');
  });

  it('formats 9:05 AM correctly with leading zero on minutes', () => {
    const date = new Date(2024, 0, 1, 9, 5, 0);
    expect(formatTimeToHHMMPM(date)).toBe('9:05 AM');
  });

  it('formats 3:30 PM correctly', () => {
    const date = new Date(2024, 0, 1, 15, 30, 0);
    expect(formatTimeToHHMMPM(date)).toBe('3:30 PM');
  });

  it('formats 11:59 PM correctly', () => {
    const date = new Date(2024, 0, 1, 23, 59, 0);
    expect(formatTimeToHHMMPM(date)).toBe('11:59 PM');
  });
});

describe('toHumanReadableRelativeTimeFromDate', () => {
  it('returns "a few seconds ago" for a very recent date', () => {
    const now = new Date();
    const result = toHumanReadableRelativeTimeFromDate(now);
    expect(result).toMatch(/seconds? ago|a few seconds ago/);
  });

  it('returns a relative string for a date 2 hours ago', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const result = toHumanReadableRelativeTimeFromDate(twoHoursAgo);
    expect(result).toMatch(/2 hours? ago/);
  });

  it('returns a relative string for a date 1 day ago', () => {
    const yesterday = new Date(Date.now() - 25 * 60 * 60 * 1000);
    const result = toHumanReadableRelativeTimeFromDate(yesterday);
    expect(result).toMatch(/a day ago|days? ago/);
  });
});
