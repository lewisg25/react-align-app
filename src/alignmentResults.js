export const seedCategories = [
  "Foundation & Discovery",
  "Future Planning",
  "Growth",
  "Communication",
  "Habits & Traditions",
  "Connection",
  "Personal Growth",
  "Experiences",
  "Values",
  "Maintaining the Spark",
  "Trust",
];

const categoryCopy = {
  "Foundation & Discovery": "How well you are still learning, noticing, and naming what matters to each other.",
  "Future Planning": "Shared clarity around money, goals, timelines, and the next chapter you are building.",
  Growth: "How intentionally you are improving patterns and supporting change together.",
  Communication: "Your ability to talk honestly, listen well, and repair misunderstandings early.",
  "Habits & Traditions": "The routines and rituals that make the relationship feel steady and familiar.",
  Connection: "Emotional closeness, appreciation, and the small moments that keep you bonded.",
  "Personal Growth": "How each partner's individual goals are seen and supported inside the relationship.",
  Experiences: "The freshness, adventure, and shared memories you are continuing to create.",
  Values: "Alignment around what a healthy, meaningful long-term relationship should feel like.",
  "Maintaining the Spark": "Playfulness, romance, and energy that keep the relationship alive over time.",
  Trust: "Confidence, emotional safety, and reliability between both partners.",
};

const starterScore = (index) => 58 + ((index * 7) % 24);

export const scoreFromMoodScale = (moodScale) =>
  Math.min(100, Math.max(20, Number(moodScale || 3) * 20));

export function buildAlignmentResults(responses = []) {
  const byCategory = responses.reduce((groups, response) => {
    const category = response.category || "Connection";
    const score = scoreFromMoodScale(response.moodScale);
    return { ...groups, [category]: [...(groups[category] || []), score] };
  }, {});

  const categories = seedCategories.map((category, index) => {
    const scores = byCategory[category] || [];
    const percent = scores.length
      ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length)
      : starterScore(index);

    return {
      category,
      percent,
      description: categoryCopy[category],
      responseCount: scores.length,
    };
  });

  const overall = Math.round(
    categories.reduce((total, item) => total + item.percent, 0) / categories.length
  );

  return { categories, overall };
}
