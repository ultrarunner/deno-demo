import type { Story } from "../api/types.ts";

export async function fetchTopStories(): Promise<Story[]> {
  const storyIds = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  )
    .then((r) => r.json());

  const stories = await Promise.all(
    storyIds.slice(0, 15).map((id: number) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .then((r) => r.json())
    ),
  );

  return stories
    .filter((s) => s && s.title)
    .map((story) => ({
      type: "news" as const,
      id: story.id,
      title: story.title,
      url: story.url,
      score: story.score || 0,
      by: story.by,
      time: story.time,
      descendants: story.descendants,
      text: story.text || "",
    }));
}
