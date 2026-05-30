/**
 * Servidor estático mínimo para Fujistreet (sin dependencias).
 * Diseñado para Railway: escucha en process.env.PORT y host 0.0.0.0.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

function send(res, status, headers, stream) {
  res.writeHead(status, headers);
  if (stream && stream.pipe) stream.pipe(res);
  else res.end(stream);
}

const server = http.createServer((req, res) => {
  // Solo GET/HEAD
  if (req.method !== "GET" && req.method !== "HEAD") {
    return send(res, 405, { "Content-Type": "text/plain" }, "Method Not Allowed");
  }

  // Decodificar la URL (los nombres de archivo tienen espacios, p.ej. %20)
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split("?")[0]);
  } catch {
    urlPath = req.url.split("?")[0];
  }
  if (urlPath === "/" || urlPath === "") urlPath = "/index.html";

  // Resolver de forma segura dentro de ROOT (evita path traversal)
  const filePath = path.join(ROOT, path.normalize(urlPath));
  if (!filePath.startsWith(ROOT)) {
    return send(res, 403, { "Content-Type": "text/plain" }, "Forbidden");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback al index para rutas no encontradas
      const fallback = path.join(ROOT, "index.html");
      return send(
        res,
        err ? 404 : 200,
        { "Content-Type": MIME[".html"] },
        fs.createReadStream(fallback)
      );
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    // Cache: assets estáticos largo, html corto
    const cache = ext === ".html"
      ? "no-cache"
      : "public, max-age=86400";

    const headers = {
      "Content-Type": type,
      "Content-Length": stats.size,
      "Cache-Control": cache,
    };

    if (req.method === "HEAD") return send(res, 200, headers);
    send(res, 200, headers, fs.createReadStream(filePath));
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Fujistreet sirviéndose en http://${HOST}:${PORT}`);
});
