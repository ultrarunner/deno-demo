import type { Joke } from "../api/types.ts";

export async function fetchJokes(): Promise<Joke[]> {
  const response = await fetch(
    "https://v2.jokeapi.dev/joke/Programming?safe-mode&amount=15",
  );
  const data = await response.json();

  if (data.jokes) {
    return data.jokes.map((joke: { id: number; category: string; joke?: string; setup?: string; delivery?: string }) => ({
      type: "joke" as const,
      id: joke.id,
      category: joke.category,
      text: joke.joke || `${joke.setup} ${joke.delivery}`,
    }));
  }
  return [];
}
