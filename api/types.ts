export interface Story {
  type: "news";
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
  text?: string;
}

export interface Joke {
  type: "joke";
  id: number;
  category: string;
  text: string;
}

export interface Podcast {
  title: string;
  link: string;
  audio?: string;
}

export interface FeedItem {
  id: string;
  title: string;
  filter: string;
  badges: { label: string; color: string }[];
  sourceUrl: string;
  items: {
    title?: string;
    link?: string;
    audio?: string;
    score?: number;
    text?: string;
  }[];
}

export interface FeedResponse {
  programmingJokes: Joke[];
  topStories: Story[];
  timHarford: Podcast[];
  podcasts: Podcast[];
  nyTimes: Podcast[];
}
