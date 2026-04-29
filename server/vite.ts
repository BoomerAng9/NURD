import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  if (process.env.NODE_ENV !== "development") return;

  // Dynamic imports keep vite/plugin-react/nanoid out of the production bundle.
  // They are devDependencies; the prod-deps stage prunes them. Importing
  // vite.config.ts at runtime would also bundle vite into dist/index.js
  // (esbuild hoists its static `import "vite"` to the bundle root), so the
  // necessary config is duplicated inline below.
  const { createServer: createViteServer, createLogger } = await import("vite");
  const reactPlugin = (await import("@vitejs/plugin-react")).default;
  const { nanoid } = await import("nanoid");

  const viteLogger = createLogger();
  const repoRoot = path.resolve(import.meta.dirname, "..");

  const vite = await createViteServer({
    plugins: [reactPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(repoRoot, "client", "src"),
        "@shared": path.resolve(repoRoot, "shared"),
        "@assets": path.resolve(repoRoot, "attached_assets"),
      },
    },
    root: path.resolve(repoRoot, "client"),
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: {
      middlewareMode: true,
      hmr: { server },
      allowedHosts: true,
    },
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        repoRoot,
        "client",
        "index.html",
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
