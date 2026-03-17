export default {
  fetch(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === "/live-reload") {
      return new Response(new ReadableStream({
        start(controller) {
          const watcher = Deno.watchFs(["index.html", "style.css"]);
          const encoder = new TextEncoder();
          
          (async () => {
            try {
              for await (const event of watcher) {
                if (event.kind === "modify") {
                  controller.enqueue(encoder.encode(`data: reload\n\n`));
                }
              }
            } catch {
              // Watcher stopped, ignore
            }
          })();

          request.signal.addEventListener("abort", () => {
            watcher.close();
            controller.close();
          });
        },
      }), {
        headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
      });
    }

    if (url.pathname === "/style.css") {
      const cssContent = Deno.readTextFileSync("./style.css");
      return new Response(cssContent, {
        headers: { "Content-Type": "text/css" },
      });
    }

    const htmlContent = Deno.readTextFileSync("./index.html");
    return new Response(htmlContent, {
      headers: { "Content-Type": "text/html" },
    });
  },
};
