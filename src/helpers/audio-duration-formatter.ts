export function formatDuration(durationInSeconds: number): string {
  if (!Number.isFinite(durationInSeconds) || durationInSeconds < 0) return "0:00";
  const roundedDuration = Math.round(durationInSeconds);
  const minutes = Math.floor(roundedDuration / 60);
  const seconds = roundedDuration % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

/** Converte "1:23" (formato salvo no banco) em segundos. */
export function parseDuration(texto?: string | null): number {
  if (!texto) return 0;
  const partes = texto.split(":").map((parte) => Number(parte.trim()));
  if (partes.some((parte) => Number.isNaN(parte))) return 0;
  return partes.reduce((total, parte) => total * 60 + parte, 0);
}
