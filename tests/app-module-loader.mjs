import { createServer } from "vite";

// Use the app's JSX, aliases, and environment transforms without a browser/backend.
export async function withAppServer(run) {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false, ws: false },
    optimizeDeps: { noDiscovery: true, include: [] },
    appType: "custom",
    logLevel: "error",
  });
  try {
    return await run(server);
  } finally {
    await server.close();
  }
}
