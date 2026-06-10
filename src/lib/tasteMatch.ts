/**
 * Placeholder taste-match scoring.
 * Replace with real profile-based matching once taste onboarding exists.
 */
export function getTasteMatch(gigId: string): number {
  const seed = gigId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return 55 + (seed % 44)
}

export function getTasteMatchLabel(score: number): string {
  if (score >= 90) return 'Perfect match'
  if (score >= 80) return 'Great match'
  if (score >= 70) return 'Good match'
  return 'Worth a look'
}
