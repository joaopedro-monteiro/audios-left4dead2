export function formatDuration(durationInSeconds: number): string {
    const roundedDuration = Math.round(durationInSeconds);
    const minutes = Math.floor(roundedDuration / 60);
    const seconds = roundedDuration % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }