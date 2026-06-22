/** Story menu grouping — lessons vs optional social replays. */

export const SOCIAL_STORY_IDS = new Set([
  "courtyard-dog",
  "courtyard-janitor",
]);

export function isSocialStory(summary) {
  return SOCIAL_STORY_IDS.has(summary?.id);
}

export function partitionMenuStories(catalogList) {
  const lessons = [];
  const social = [];
  for (const s of catalogList || []) {
    if (isSocialStory(s)) social.push(s);
    else lessons.push(s);
  }
  return { lessons, social };
}

/** Flat menu rows with section category and display number. */
export function buildMenuItems(catalogList) {
  const { lessons, social } = partitionMenuStories(catalogList);
  const items = [];
  let n = 1;
  for (const s of lessons) {
    items.push({
      n,
      category: "lesson",
      storyId: s.id,
      title: s.title,
      description: s.description,
    });
    n += 1;
  }
  for (const s of social) {
    items.push({
      n,
      category: "social",
      storyId: s.id,
      title: s.title,
      description: s.description,
    });
    n += 1;
  }
  return items;
}

export function menuItemByNumber(items, pickNum) {
  const n = Number(pickNum);
  if (!Number.isInteger(n) || n < 1) return null;
  return items.find((x) => x.n === n) ?? null;
}
