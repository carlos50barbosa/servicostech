const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = __dirname;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function log(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const fields = Object.entries(meta)
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join(" ");
  const line = fields ? `[${timestamp}] ${level} ${message} ${fields}` : `[${timestamp}] ${level} ${message}`;

  if (level === "ERROR") {
    console.error(line);
    return;
  }

  console.log(line);
}

function getClientIp(request) {
  const forwardedFor = request.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.socket.remoteAddress || "unknown";
}

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, `http://localhost:${PORT}`);
  const pathname = decodeURIComponent(url.pathname);
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(PUBLIC_DIR, requestedPath));
  const relativePath = path.relative(PUBLIC_DIR, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return filePath;
}

async function sendFile(response, filePath) {
  const file = await fs.readFile(filePath);
  const extension = path.extname(filePath).toLowerCase();

  response.writeHead(200, {
    "Content-Type": mimeTypes[extension] || "application/octet-stream"
  });
  response.end(file);
}

const server = http.createServer(async (request, response) => {
  const startedAt = process.hrtime.bigint();
  const clientIp = getClientIp(request);

  response.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    log("INFO", "request", {
      method: request.method,
      url: request.url,
      status: response.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      ip: clientIp,
      userAgent: request.headers["user-agent"] || ""
    });
  });

  if (!request.url || request.method !== "GET") {
    response.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Metodo nao permitido");
    return;
  }

  const filePath = resolveRequestPath(request.url);

  if (!filePath) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Acesso negado");
    return;
  }

  try {
    await sendFile(response, filePath);
  } catch (error) {
    const statusCode = error.code === "ENOENT" ? 404 : 500;

    log(statusCode === 404 ? "INFO" : "ERROR", "file_response_error", {
      url: request.url,
      filePath,
      status: statusCode,
      code: error.code || "UNKNOWN",
      message: error.message
    });

    response.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(statusCode === 404 ? "Arquivo nao encontrado" : "Erro interno");
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    log("ERROR", "port_in_use", {
      port: PORT,
      hint: "Feche o outro servidor ou rode com outra porta: PORT=3001 npm start"
    });
    process.exit(1);
  }

  log("ERROR", "server_error", {
    code: error.code || "UNKNOWN",
    message: error.message,
    stack: error.stack
  });

  throw error;
});

server.listen(PORT, () => {
  log("INFO", "server_started", {
    port: PORT,
    publicDir: PUBLIC_DIR,
    nodeEnv: process.env.NODE_ENV || "development"
  });
});
