import type { FeedResponse } from "./types.ts";
import { fetchTopStories } from "../services/hackernews.ts";
import { fetchJokes } from "../services/jokes.ts";
import { fetchTimHarford, fetchPodcasts, fetchNYTimes } from "../services/rss.ts";

export async function getFeed(): Promise<FeedResponse> {
  const [stories, jokes, timHarford, podcasts, nyTimes] = await Promise.all([
    fetchTopStories(),
    fetchJokes(),
    fetchTimHarford(),
    fetchPodcasts(),
    fetchNYTimes(),
  ]);

  const topStories = [...stories].sort((a, b) => b.score - a.score).slice(0, 7);

  return {
    programmingJokes: jokes.slice(0, 7),
    topStories,
    timHarford,
    podcasts,
    nyTimes,
  };
}
