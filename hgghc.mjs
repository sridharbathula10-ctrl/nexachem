import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";
import nextEnv from "@next/env";
import { ContactEmailError, sendContactEmail } from "./src/lib/contact-email.mjs";

nextEnv.loadEnvConfig(process.cwd());

const outputDir = resolve("out");
const mime = { ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".ico": "image/x-icon", ".jpeg": "image/jpeg", ".jpg": "image/jpeg", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml", ".txt": "text/plain; charset=utf-8", ".webp": "image/webp", ".woff": "font/woff", ".woff2": "font/woff2" };

function json(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 64 * 1024) throw new ContactEmailError("Request is too large.", 413);
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new ContactEmailError("Invalid request.", 400); }
}

async function contact(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return json(response, 405, { error: "Method not allowed." });
  }
  try {
    await sendContactEmail(await readJson(request));
    return json(response, 200, { ok: true });
  } catch (error) {
    if (error instanceof ContactEmailError) return json(response, error.status, { error: error.message });
    console.error("SMTP delivery failed:", error);
    return json(response, 502, { error: "Could not send your enquiry. Check the SMTP settings and try again." });
  }
}

async function staticFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  const relative = decoded.replace(/^\/+/, "");
  const candidates = decoded === "/" ? ["index.html"] : [relative, `${relative}.html`, join(relative, "index.html")];
  for (const candidate of candidates) {
    const file = resolve(outputDir, candidate);
    if (file !== outputDir && !file.startsWith(`${outputDir}${sep}`)) continue;
    try { if ((await stat(file)).isFile()) return file; } catch {}
  }
  return null;
}

const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url || "/", "http://localhost").pathname;
    if (pathname === "/api/contact" || pathname === "/api/contactpuku") return await contact(request, response);
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.setHeader("Allow", "GET, HEAD");
      return json(response, 405, { error: "Method not allowed." });
    }
    const file = await staticFile(pathname);
    if (!file) {
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      const notFound = resolve(outputDir, "404.html");
      return request.method === "HEAD" ? response.end() : createReadStream(notFound).pipe(response);
    }
    response.writeHead(200, { "Content-Type": mime[extname(file)] || "application/octet-stream", "X-Content-Type-Options": "nosniff" });
    return request.method === "HEAD" ? response.end() : createReadStream(file).pipe(response);
  } catch (error) {
    if (error instanceof URIError) return json(response, 400, { error: "Invalid URL." });
    console.error("Request failed:", error);
    if (!response.headersSent) return json(response, 500, { error: "Server error." });
    response.destroy(error);
  }
});

const port = Number(process.env.PORT || 3000);
server.listen(port, "0.0.0.0", () => console.log(`NexaChem server listening on port ${port}`));
