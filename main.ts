import { getFeed } from "./api/feed.ts";

const decoder = new TextDecoder();

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (pathname === "/api/feed") {
    const feed = await getFeed();
    return new Response(JSON.stringify(feed), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  if (pathname === "/live-reload") {
    const encoder = new TextEncoder();
    const body = new ReadableStream({
      start(controller) {
        const watcher = Deno.watchFs(["./static"]);
        
        (async () => {
          try {
            for await (const event of watcher) {
              if (event.kind === "modify") {
                controller.enqueue(encoder.encode(`data: reload\n\n`));
              }
            }
          } catch {
            // Watcher stopped
          }
        })();

        req.signal.addEventListener("abort", () => {
          watcher.close();
          controller.close();
        });
      },
    });
    return new Response(body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  }

  const staticDir = Deno.cwd() + "/static";

  if (pathname === "/" || pathname === "/index.html") {
    const html = await Deno.readTextFile(staticDir + "/index.html");
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }

  if (pathname === "/style.css") {
    const css = await Deno.readTextFile(staticDir + "/style.css");
    return new Response(css, { headers: { "Content-Type": "text/css" } });
  }

  return new Response("Not Found", { status: 404 });
});
