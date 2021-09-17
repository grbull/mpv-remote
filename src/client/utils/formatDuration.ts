// https://stackoverflow.com/a/25279399
// returns hh:mm:ss
export function formatDuration(seconds: number): string {
  return new Date(1000 * seconds).toISOString().substr(11, 8);
}
