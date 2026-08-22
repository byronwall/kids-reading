export function normalizeWords(input: string): string[] {
  return Array.from(
    new Set(
      input
        .split(/,|\n/)
        .map((word) => word.trim().toLowerCase())
        .filter(Boolean)
    )
  );
}
