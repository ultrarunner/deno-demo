import type { Podcast } from "../api/types.ts";

interface RssItem {
  title?: string;
  link?: string;
  enclosure?: { link?: string };
  audio?: string;
}

interface RssResponse {
  status: string;
  items?: RssItem[];
}

async function fetchRss(url: string): Promise<Podcast[]> {
  const response = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`,
  );
  const data: RssResponse = await response.json();

  if (data.status === "ok" && data.items) {
    return data.items.slice(0, 7).map((item) => ({
      title: item.title || "",
      link: item.link || "",
      audio: item.enclosure?.link || item.audio || "",
    }));
  }
  return [];
}

export async function fetchTimHarford(): Promise<Podcast[]> {
  try {
    return await fetchRss("https://podcasts.files.bbci.co.uk/p02pc9tn.rss");
  } catch (e) {
    console.error("Tim Harford fetch error:", e);
    return [];
  }
}

export async function fetchPodcasts(): Promise<Podcast[]> {
  try {
    return await fetchRss("https://feeds.simplecast.com/BqbsxVfO");
  } catch (e) {
    console.error("Podcast fetch error:", e);
    return [];
  }
}

export async function fetchNYTimes(): Promise<Podcast[]> {
  try {
    return await fetchRss("https://rss.nytimes.com/services/xml/rss/nyt/World.xml");
  } catch (e) {
    console.error("NY Times fetch error:", e);
    return [];
  }
}
