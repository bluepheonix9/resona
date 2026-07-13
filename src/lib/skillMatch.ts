/**
 * Placeholder skill-match scoring.
 * Replace with real profile-based matching once skill onboarding exists.
 */
export function getSkillMatch(gameId: string): number {
  const seed = gameId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return 55 + (seed % 44)
}

export function getSkillMatchLabel(score: number): string {
  if (score >= 90) return 'Perfect level'
  if (score >= 80) return 'Great fit'
  if (score >= 70) return 'Good fit'
  return 'Worth trying'
}
