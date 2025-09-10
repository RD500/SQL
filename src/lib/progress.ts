
'use client';

const COMPLETED_QUESTS_KEY = 'completed_quests';

// Gets the list of completed quest IDs from localStorage
export function getCompletedQuests(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const completed = localStorage.getItem(COMPLETED_QUESTS_KEY);
  return completed ? JSON.parse(completed) : [];
}

// Adds a quest ID to the list of completed quests in localStorage
export function completeQuest(questId: string): void {
    if (typeof window === 'undefined') {
        return;
    }
  const completed = getCompletedQuests();
  if (!completed.includes(questId)) {
    const updated = [...completed, questId];
    localStorage.setItem(COMPLETED_QUESTS_KEY, JSON.stringify(updated));
    // Dispatch a custom event so other components can react to progress changes
    window.dispatchEvent(new Event('progressUpdated'));
  }
}

// Calculates the number of badges earned based on completed quests
// For now, let's say 1 badge per 2 completed quests
export function getBadges(): number {
  const completedCount = getCompletedQuests().length;
  return Math.floor(completedCount / 2);
}

// Resets all progress
export function resetProgress(): void {
    if (typeof window === 'undefined') {
        return;
    }
  localStorage.removeItem(COMPLETED_QUESTS_KEY);
  window.dispatchEvent(new Event('progressUpdated'));
}
