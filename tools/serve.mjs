#!/usr/bin/env node
// Tiny static server for the offline boot test.
// Usage: node tools/serve.mjs [port] [documentRoot]
//   port          defaults to 8000
//   documentRoot  defaults to the repo root (parent of this script's dir)
// Binds 127.0.0.1 only. No SPA fallback: a missing file is an honest 404.

import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.argv[2] || 8000);
const ROOT = resolve(process.argv[3] || join(here, '..'));

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.gz': 'application/gzip',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.bin': 'application/octet-stream',
  '.dat': 'application/octet-stream',
  '.hdr': 'application/octet-stream',
  '.ktx2': 'application/octet-stream',
};

function log(path, status) {
  process.stdout.write(`${new Date().toISOString()} ${status} ${path}\n`);
}

function send(res, status, body, path) {
  log(path, status);
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(body);
}

const server = createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
  } catch {
    return send(res, 400, 'bad request\n', req.url);
  }

  // Resolve inside ROOT and refuse anything that escapes it.
  const target = normalize(join(ROOT, urlPath));
  if (target !== ROOT && !target.startsWith(ROOT + sep)) {
    return send(res, 403, 'forbidden\n', urlPath);
  }

  let file = target;
  try {
    if (statSync(file).isDirectory()) file = join(file, 'index.html');
  } catch {
    return send(res, 404, 'not found\n', urlPath);
  }

  let st;
  try {
    st = statSync(file);
  } catch {
    return send(res, 404, 'not found\n', urlPath);
  }
  if (!st.isFile()) return send(res, 404, 'not found\n', urlPath);

  const type = TYPES[extname(file).toLowerCase()] || 'application/octet-stream';
  log(urlPath, 200);
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size });
  createReadStream(file).pipe(res);
});

server.listen(PORT, '127.0.0.1', () => {
  process.stdout.write(`serving ${ROOT} at http://127.0.0.1:${PORT}/\n`);
});
