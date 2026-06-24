export const MILESTONES = [7, 14, 30, 50, 100, 200, 365, 500, 520, 730, 1000, 1314, 2000, 3000, 5000];

export type MilestoneInfo =
  | { value: number; status: 'at'; daysTo: 0 }
  | { value: number; status: 'approaching'; daysTo: number };

// Returns milestone info if absDiff is AT or within 7 days BEFORE a milestone.
export function getMilestoneInfo(absDiff: number): MilestoneInfo | null {
  if (MILESTONES.includes(absDiff)) {
    return { value: absDiff, status: 'at', daysTo: 0 };
  }
  if (absDiff > 0) {
    for (const m of MILESTONES) {
      const remaining = m - absDiff;
      if (remaining > 0 && remaining <= 7) {
        return { value: m, status: 'approaching', daysTo: remaining };
      }
    }
  }
  return null;
}
