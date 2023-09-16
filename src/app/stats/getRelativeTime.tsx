export function getRelativeTime(date: Date | undefined): string {
  if (!date) return "never";

  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const isPast = diff < 0;
  const absDiff = Math.abs(diff);

  // Time units in milliseconds
  const msInDay = 1000 * 60 * 60 * 24;
  const msInWeek = msInDay * 7;
  const msInMonth = msInDay * 30; // Approximation
  const msInYear = msInDay * 365; // Approximation

  // Calculate time differences in various units
  const days = Math.floor(absDiff / msInDay);
  const weeks = Math.floor(absDiff / msInWeek);
  const months = Math.floor(absDiff / msInMonth);
  const years = Math.floor(absDiff / msInYear);

  // Generate appropriate label
  let label = "";

  if (days < 1) {
    label = "now";
  } else if (days < 7) {
    label = `${days}d`;
  } else if (years < 1) {
    label = `${weeks}w`;
  } else {
    label = `${years}y`;
  }

  // Add "ago" for past times
  return isPast ? `${label} ago` : label;
}
