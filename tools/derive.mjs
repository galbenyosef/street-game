// derive.mjs — rebuild the derived layers (readable/ + src/ + split-spec.json)
// from the street-game capture (PLAN §3/§5). STREET GAME
// (https://street-game.centro-datos-crudo.workers.dev/) is capture-class: a Vite
// production build of a Spanish-language 3D street-marbles game, served at the
// origin root by Cloudflare Workers. §0.4 fork-over-mirror was checked on
// 2026-10-12 — neither the page nor its JS references a public source repo
// (zero github.com/gitlab.com references in the capture; the credits point to
// the X account @IAenCrudo, and a GitHub search for the project finds nothing),
// so the mirror stands. The capture is untouched; every source file is re-hashed
// against .upstream/manifest.json before it is rendered, so a drifted capture
// fails loudly instead of being silently re-derived.
//
// Pipeline:
//   the capture's single app bundle assets/index-HDif5lFa.js -> pinned prettier
//                        3.9.6 (module API — the CLI respects .gitignore and can
//                        silently echo its input), single pass, verified
//                        idempotent -> readable/assets__index-HDif5lFa.pretty.js
//                        (capture-root-relative name, nested dirs flattened __).
//   bundled three.js     -> wholeFile sections (vendor rule): the Vite
//                        modulepreload polyfill, the three.js r1xx core region
//                        (everything before the WebGLRenderer declaration) and
//                        the WebGLRenderer implementation region are indexed
//                        whole, never sliced.
//   app code             -> statement-aligned slices src/<tag>-NN.js at
//                        top-level declaration boundaries, ~250-350 line
//                        windows (oversized single declarations stay whole),
//                        exact 2-line provenance header; every slice is
//                        parse-checked with `node --input-type=module --check -`
//                        and round-trips byte-exact to its readable line range.
//   the capture's stylesheet assets/index-BM9TqdBo.css -> readable pretty,
//                        wholeFile section (stylesheet rule: never sliced).
//   media/font/image payloads -> notRendered records (bytes + sha256), no
//                        pretty pass.
//   entry document       -> inline <script>/<style> scan (byte ranges + sha256):
//                        index.html references external chunks only — zero
//                        inline content blocks, so there are no *-inline-N
//                        twins and no index-inline-map.json.
//
// The minifier merged the app's level-config declarators (q, cl, ll, ul, dl, fl,
// pl, ml, hl, gl, _l, vl) into the SAME top-level VariableDeclaration as the
// WebGLRenderer class (`var sl = class {…}, q = {…}, …`). The split is content-
// anchored and guarded: the `sl` class declarator (lines 22657-24293) is the
// renderer vendor region (wholeFile), the app declarators (24294-24497) become
// one explicit ranged slice whose body is the exact declarator list text (a
// comma-chain of assignments — syntactically standalone, byte-exact against its
// readable range), and everything after resumes at statement boundaries.
// A missing anchor fails the run.
//
// Identifiers in src/ are the bundle's own minified names — the rename campaign
// (PLAN §5) is recorded as an open task in README.md. usage:
//   node tools/derive.mjs
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const proj = path.resolve(here, "..");
const PINNED = "3.9.6";
const MIN_WINDOW = 250;
const MAX_WINDOW = 350;
const TODAY = "2026-10-12";
const ROOT = ""; // capture root (the served site root — capture sits at the repo root)

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const readLines = (abs) => {
  const t = fs.readFileSync(abs, "utf8");
  const l = t.split("\n");
  if (l.length && l[l.length - 1] === "") l.pop();
  return l;
};
const linesOf = (text) => text.replace(/\n$/, "").split("\n");
const lineOf = (text, offset) => text.slice(0, offset).split("\n").length;

// capture-relative name -> readable twin name (dirs flattened with __)
const tagOf = (capRel) => {
  const rel = capRel.startsWith(ROOT) ? capRel.slice(ROOT.length) : capRel;
  return rel.replace(/\.(js|css)$/i, "").split("/").join("__");
};
const prettyRelFor = (capRel) =>
  "readable/" + tagOf(capRel) + (/\.css$/i.test(capRel) ? ".pretty.css" : ".pretty.js");

// ── pinned prettier (module API, exactly 3.9.6) ─────────────────────────
async function loadPrettier() {
  const candidates = [
    process.env.PRETTIER_MJS,
    path.join(proj, "node_modules", "prettier", "index.mjs"),
    "D:/repos/mirrors/metropolygonia/node_modules/prettier/index.mjs",
  ].filter(Boolean);
  for (const c of candidates) {
    if (!fs.existsSync(c)) continue;
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(path.dirname(c), "package.json"), "utf8"));
      if (pkg.version !== PINNED) continue;
      const mod = (await import(pathToFileURL(c).href)).default;
      if (mod.version === PINNED) return { mod, at: c };
    } catch {
      /* try next */
    }
  }
  throw new Error(`pinned prettier ${PINNED} not found (set PRETTIER_MJS to its index.mjs)`);
}

// single pass + idempotency proof: prettier output must be a fixed point of
// the same call, so audit's one-pass re-render is byte-exact by construction
async function formatOnce(prettier, text, parser) {
  const out = await prettier.format(text, { parser });
  const again = await prettier.format(out, { parser });
  if (again !== out) throw new Error(`prettier ${parser} is not idempotent on this input`);
  return out;
}

// ── parse check: the exact standalone gate (ESM stdin) ──────────────────
function parses(text) {
  const r = spawnSync(process.execPath, ["--input-type=module", "--check", "-"], {
    input: text,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  return { ok: r.status === 0, why: (r.stderr || "").trim().split("\n").slice(-3).join(" | ") };
}

// ── markers for titles (top tokens, lowercase; fleet convention) ────────
const STOP = new Set(
  ("function return typeof undefined object string number boolean prototype length value default " +
    "exports import this that with from then else case break continue delete instanceof constructor " +
    "arguments void null true false call apply name type text target window document globalthis self " +
    "require module async await yield static class const let var new for while switch throw try catch " +
    "finally extends super using debugger of in do if has own hasown get set")
    .split(" ")
    .filter(Boolean),
);
function markers(text, n = 2) {
  // URLs/identifiers living inside string literals (import paths, asset names)
  // are not code tokens — strip quoted strings before counting
  const code = text.replace(/`[^`]*`|"[^"\n]*"|'[^'\n]*'/g, " ");
  const counts = new Map();
  for (const m of code.matchAll(/[A-Za-z][A-Za-z0-9_]{2,}/g)) {
    const w = m[0].toLowerCase();
    if (STOP.has(w)) continue;
    counts.set(w, (counts.get(w) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n);
}
const markerText = (ms) => ms.map(([w, c]) => `${w}(${c})`).join(", ");

// ── windowize: cut only at statement starts; ≤350 lines, a single ───────
// ── oversized declaration is a window of its own ────────────────────────
function windowize(stmts) {
  const out = [];
  let cur = null;
  for (const s of stmts) {
    if (!cur) {
      cur = { first: s, last: s, count: 1, startLine: s.startLine, endLine: s.endLine };
      continue;
    }
    const projected = s.endLine - cur.startLine + 1;
    if (projected > MAX_WINDOW) {
      out.push(cur);
      cur = { first: s, last: s, count: 1, startLine: s.startLine, endLine: s.endLine };
    } else {
      cur.last = s;
      cur.count++;
      cur.endLine = s.endLine;
    }
  }
  if (cur) out.push(cur);
  return out;
}

// ── inline block scan (byte-exact, over the raw entry buffer) ───────────
function scanBlocks(buf) {
  const blocks = [];
  for (const [open, close, kind] of [
    ["<script", "</script", "script"],
    ["<style", "</style", "style"],
  ]) {
    let p = 0;
    let n = 0;
    while (true) {
      const i = buf.indexOf(open, p);
      if (i < 0) break;
      const after = buf[i + open.length];
      const boundary =
        after === 0x3e || after === 0x2f || after === 0x20 || after === 0x09 || after === 0x0a || after === 0x0d;
      if (!boundary) {
        p = i + open.length;
        continue;
      }
      const tagEnd = buf.indexOf(">", i);
      if (tagEnd < 0) break;
      const j = buf.indexOf(close, tagEnd + 1);
      if (j < 0) throw new Error(`unterminated <${kind}> opened at byte ${i}`);
      const tag = buf.subarray(i, tagEnd + 1).toString("utf8");
      const external = /\bsrc\s*=\s*["']/i.test(tag);
      if (external) {
        blocks.push({ kind, external: true, tag, openStart: i, contentStart: tagEnd + 1, contentEnd: j });
      } else {
        n++;
        const content = buf.subarray(tagEnd + 1, j);
        blocks.push({
          kind: /\btype\s*=\s*["']importmap["']/i.test(tag) ? "importmap" : kind,
          external: false,
          block: n,
          tag,
          openStart: i,
          contentStart: tagEnd + 1,
          contentEnd: j,
          bytes: content.length,
          sha256: sha256(content),
          text: content.toString("utf8"),
        });
      }
      p = j + close.length;
    }
  }
  return blocks.sort((a, b) => a.openStart - b.openStart);
}

async function main() {
  const { mod: prettier, at } = await loadPrettier();
  console.log(`pinned prettier ${PINNED} (${at})`);

  const manifest = JSON.parse(fs.readFileSync(path.join(proj, ".upstream", "manifest.json"), "utf8"));
  const captured = Object.keys(manifest.files).map((r) => r.split(path.sep).join("/")).sort();
  const captureBytes = (rel) => {
    const abs = path.join(proj, rel);
    if (!fs.existsSync(abs)) throw new Error(`capture file missing: ${rel}`);
    const buf = fs.readFileSync(abs);
    if (sha256(buf) !== manifest.files[rel].sha256)
      throw new Error(`${rel} on disk does not match .upstream/manifest.json — re-verify the capture first`);
    return buf;
  };

  const readableDir = path.join(proj, "readable");
  const srcDir = path.join(proj, "src");
  fs.mkdirSync(readableDir, { recursive: true });
  fs.mkdirSync(srcDir, { recursive: true });
  const written = { readable: new Set(), src: new Set() };

  const sources = [];
  const sections = [];
  const notRendered = [];
  const inlineFiles = [];
  let slicedTotal = 0;

  const jsRels = captured.filter((r) => /\.js$/i.test(r));
  const cssRels = captured.filter((r) => /\.css$/i.test(r));
  const htmlRels = captured.filter((r) => /\.html$/i.test(r));

  // ── 1) JS: prettify, then vendor wholeFile regions + app slices ────────
  for (const rel of jsRels) {
    const buf = captureBytes(rel);
    const text = buf.toString("utf8");
    if (!Buffer.from(text, "utf8").equals(buf)) throw new Error(`${rel} does not round-trip through utf8`);
    const pretty = await formatOnce(prettier, text, "babel");
    if (pretty === text)
      throw new Error(`${rel}: prettier output is byte-identical to the capture — nothing to derive`);
    const sourceFile = prettyRelFor(rel);
    fs.writeFileSync(path.join(proj, sourceFile), pretty);
    written.readable.add(path.basename(sourceFile));
    const lines = linesOf(pretty);
    const tag = tagOf(rel);

    // ── app chunk: parse top-level statements ──────────────────────────
    const dbg = await prettier.__debug.parse(pretty, { parser: "babel" });
    const top = (dbg.ast.program || dbg.ast).body;
    const stmts = top.map((n) => ({
      node: n,
      startLine: lineOf(pretty, n.start),
      endLine: lineOf(pretty, n.end),
      text: pretty.slice(n.start, n.end),
    }));
    for (let i = 1; i < stmts.length; i++)
      if (stmts[i].startLine <= stmts[i - 1].endLine)
        throw new Error(`${rel}: statements ${i - 1}/${i} share a line — cannot slice at line boundaries`);

    // shape guards: polyfill opener, then the merged WebGLRenderer declaration
    if (!/modulepreload/.test(stmts[0].text) || stmts[0].endLine - stmts[0].startLine + 1 > 60)
      throw new Error(`${rel}: first statement is not the Vite modulepreload polyfill — readable changed shape`);
    const mergedIdx = stmts.findIndex(
      (s) =>
        s.node.type === "VariableDeclaration" &&
        s.node.declarations.length >= 5 &&
        /drawingBufferColorSpace/.test(s.text),
    );
    if (mergedIdx < 1) throw new Error(`${rel}: merged WebGLRenderer declaration not found — readable changed shape`);
    const merged = stmts[mergedIdx].node;
    const sl = merged.declarations[0];
    if (sl.id?.name !== "sl" || sl.init?.type !== "ClassExpression")
      throw new Error(`${rel}: first declarator of the merged declaration is not the WebGLRenderer class`);
    const appDecls = merged.declarations.slice(1);
    if (appDecls.length < 5 || appDecls[0].id?.name !== "q")
      throw new Error(`${rel}: app level-config declarators not found after the renderer class`);
    const rendererEnd = lineOf(pretty, sl.end); // 24293
    const appConfigStart = lineOf(pretty, appDecls[0].start); // 24294
    const appConfigEnd = stmts[mergedIdx].endLine;
    if (appConfigStart !== rendererEnd + 1)
      throw new Error(`${rel}: app config does not start on the line after the renderer class`);
    const coreStart = stmts[1].startLine;
    const coreEnd = stmts[mergedIdx - 1].endLine;
    const coreText = lines.slice(coreStart - 1, coreEnd).join("\n");
    for (const [re, what] of [
      [/__THREE__/, "__THREE__ revision registration"],
      [/WebGLRenderer/, "WebGLRenderer"],
      [/DFG_LUT/, "DFG LUT table (three.js internal tail)"],
      [/MeshPhysicalMaterial|MeshStandardMaterial/, "three.js materials"],
    ])
      if (!re.test(coreText)) throw new Error(`${rel}: three.js core region guard failed (${what})`);
    const rendererText = lines.slice(merged.start ? lineOf(pretty, merged.start) - 1 : 22656, rendererEnd).join("\n");
    for (const [re, what] of [
      [/WebGLRenderer/, "WebGLRenderer"],
      [/drawingBufferColorSpace/, "canvas color-space setup"],
      [/getContext/, "context acquisition"],
    ])
      if (!re.test(rendererText)) throw new Error(`${rel}: renderer vendor region guard failed (${what})`);

    // block plan for this chunk (line order): three wholeFile vendor regions,
    // one explicit ranged app-config slice, then statement windows over the
    // rest of the file
    const blocks = [
      {
        kind: "whole",
        file: `${tag}-polyfill-machinery.js`,
        A: stmts[0].startLine,
        B: stmts[0].endLine,
        title: `${tag} — Vite modulepreload polyfill (build machinery, whole-file, never sliced)`,
        body: "the Vite-generated modulepreload polyfill IIFE (`link[rel=modulepreload]` support check + fetch warm-up) — build machinery, not app code; indexed whole-file in readable/, never sliced.",
      },
      {
        kind: "whole",
        file: `${tag}-three-vendor.js`,
        A: coreStart,
        B: coreEnd,
        title: `${tag} — bundled three.js core (vendor region, whole-file, never sliced)`,
        body: "the bundled three.js engine core (math constants, layers, events, color management, uniforms, textures, `window.__THREE__` revision registration, geometries, materials, shaders incl. ShaderLib/UniformsLib and the curve/path/skeleton machinery) — vendor, not app code. Vendor rule — indexed whole-file in readable/, never sliced or rewritten.",
      },
      {
        kind: "whole",
        file: `${tag}-renderer-vendor.js`,
        A: stmts[mergedIdx].startLine,
        B: rendererEnd,
        title: `${tag} — bundled three.js WebGLRenderer (vendor region, whole-file, never sliced)`,
        body: "the bundled three.js WebGLRenderer implementation (canvas/context acquisition, extensions, state, shadow maps, render lists, program cache, `drawingBufferColorSpace` setup) — vendor. The minifier merged this class declarator with the app's level-config declarators into one `var` statement; this section is the class declarator only. Vendor rule — indexed whole-file in readable/, never sliced or rewritten.",
      },
      { kind: "slice", A: appConfigStart, B: appConfigEnd, count: appDecls.length, special: "app-config" },
    ];
    const appStmts = stmts.slice(mergedIdx + 1);
    for (const w of windowize(appStmts)) blocks.push({ kind: "slice", A: w.startLine, B: w.endLine, count: w.count });

    // re-tile so every line of the pretty is owned by exactly one block
    blocks.sort((a, b) => a.A - b.A);
    for (let i = 0; i < blocks.length; i++) {
      if (i === 0) blocks[i].A = 1;
      if (i + 1 < blocks.length) blocks[i].B = blocks[i + 1].A - 1;
      else blocks[i].B = lines.length;
    }

    let nn = 0;
    let perFileVendor = 0;
    for (const b of blocks) {
      if (b.kind === "slice") {
        nn++;
        const num = String(nn).padStart(2, "0");
        const body = lines.slice(b.A - 1, b.B).join("\n") + "\n";
        const ms = markers(body);
        const topWord = ms.length ? ms[0][0] : /^\s*import\b/.test(body) ? "imports" : tag.toLowerCase();
        const oversized = b.count === 1 && b.B - b.A + 1 > MAX_WINDOW;
        const file = `${tag}-${num}.js`;
        const sliceText =
          `// ${tag} ${num} — ${topWord}\n` +
          `// Lines ${b.A}-${b.B} of ${sourceFile} (statement-aligned).\n` +
          body;
        const chk = parses(sliceText);
        if (!chk.ok) throw new Error(`generated src/${file} does not parse standalone: ${chk.why}`);
        fs.writeFileSync(path.join(srcDir, file), sliceText);
        written.src.add(file);
        sections.push({
          file,
          title: `${tag} ${num} — ${topWord}`,
          desc:
            (oversized ? "Oversized single declaration (kept whole). " : "") +
            (b.special === "app-config"
              ? "App level-config declarators of the merged `var sl = class {…}, q = {…}, …` statement (the renderer class declarator is the renderer-vendor wholeFile section above); the exact declarator list text forms a syntactically standalone comma-chain of assignments. "
              : "") +
            `Lines ${b.A}-${b.B}. Markers: ${markerText(ms)}.`,
          startLine: b.A,
          endLine: b.B,
          sourceFile,
        });
      } else {
        perFileVendor++;
        sections.push({
          file: b.file,
          wholeFile: true,
          title: b.title,
          desc: `Lines ${b.A}-${b.B} of ${sourceFile}: ${b.body}`,
          note: "whole-file region (vendor/build machinery rule): indexed in readable/, never sliced",
          startLine: b.A,
          endLine: b.B,
          sourceFile,
        });
      }
    }
    slicedTotal += nn;
    sources.push({
      sourceFile,
      capture: rel,
      captureKind: "file",
      captureSha256: manifest.files[rel].sha256,
      captureBytes: buf.length,
      prettyLines: lines.length,
      prettyBytes: Buffer.byteLength(pretty, "utf8"),
      prettyPasses: 1,
      idempotent: true,
      tag,
      slices: nn,
      derived: `readable + ${nn} statement-aligned slice(s) + ${perFileVendor} wholeFile region(s)`,
    });
    console.log(
      `derive: ${rel} -> ${sourceFile} (${lines.length} lines, ${nn} slices, ${perFileVendor} wholeFile)`,
    );
  }

  // ── 2) CSS: readable pretty, wholeFile section (stylesheet rule) ────────
  for (const rel of cssRels) {
    const buf = captureBytes(rel);
    const text = buf.toString("utf8");
    const pretty = await formatOnce(prettier, text, "css");
    if (pretty === text) throw new Error(`${rel}: prettier output is byte-identical to the capture`);
    const sourceFile = prettyRelFor(rel);
    fs.writeFileSync(path.join(proj, sourceFile), pretty);
    written.readable.add(path.basename(sourceFile));
    const lines = linesOf(pretty);
    const tag = tagOf(rel);
    sections.push({
      file: `${tag}.css`,
      wholeFile: true,
      title: `${tag} — stylesheet (whole-file, never sliced)`,
      desc: `Lines 1-${lines.length} of ${sourceFile}. Whole-file (stylesheet rule): the capture stylesheet is indexed whole in readable/, never sliced.`,
      note: "whole-file (stylesheet, not sliced): CSS is indexed whole in readable/",
      startLine: 1,
      endLine: lines.length,
      sourceFile,
    });
    sources.push({
      sourceFile,
      capture: rel,
      captureKind: "file",
      captureSha256: manifest.files[rel].sha256,
      captureBytes: buf.length,
      prettyLines: lines.length,
      prettyBytes: Buffer.byteLength(pretty, "utf8"),
      prettyPasses: 1,
      idempotent: true,
      tag,
      slices: 0,
      derived: "readable only (stylesheet, wholeFile)",
    });
    console.log(`derive: ${rel} -> ${sourceFile} (${lines.length} lines, wholeFile stylesheet)`);
  }

  // ── 3) HTML entry document: inline <script>/<style> scan + twins ───────
  for (const rel of htmlRels) {
    const buf = captureBytes(rel);
    const blocks = scanBlocks(buf);
    const inline = blocks.filter((b) => !b.external);
    const external = blocks.filter((b) => b.external);
    inlineFiles.push(rel);
    for (const b of external)
      console.log(`derive: ${rel}: external ${b.kind} (not derived): ${b.tag.slice(0, 90)}`);
    if (!inline.length) {
      console.log(`derive: ${rel}: no inline <script>/<style> content blocks — no inline twins`);
      continue;
    }
    const entryTag = rel.replace(/\.html$/i, "").split("/").join("__");
    for (const b of inline) {
      const isImportmap = b.kind === "importmap";
      const parser = isImportmap ? "json" : b.kind;
      const DATA_TYPES = new Set(["application/ld+json", "application/json", "importmap", "speculationrules"]);
      const type = (/\btype\s*=\s*["']?([^"'\s>]+)/i.exec(b.tag)?.[1] ?? "").toLowerCase();
      if (parser === "script" && DATA_TYPES.has(type)) {
        notRendered.push({
          capture: rel,
          kind: "inline-data",
          type,
          byteStart: b.contentStart,
          byteEnd: b.contentEnd,
          bytes: b.bytes,
          sha256: b.sha256,
          rendered: false,
          reason: `typed data block (<script type="${type}">) — data, not JS/CSS; recorded with range + sha256, no pretty pass`,
        });
        continue;
      }
      const tag = `${entryTag}-inline-${b.block}`;
      const prettyFile = `${tag}.pretty.${isImportmap ? "json" : b.kind === "style" ? "css" : "js"}`;
      const pretty = await formatOnce(prettier, b.text, parser);
      if (pretty === b.text)
        throw new Error(`readable/${prettyFile} would be byte-identical to its capture source`);
      fs.writeFileSync(path.join(readableDir, prettyFile), pretty);
      written.readable.add(prettyFile);
      const lines = linesOf(pretty);
      sections.push({
        file: `${tag}.${isImportmap ? "json" : b.kind === "style" ? "css" : "js"}`,
        wholeFile: true,
        title: `${tag} — inline ${b.kind} block (whole-file, never sliced)`,
        desc: `Lines 1-${lines.length} of readable/${prettyFile}. Whole-file: the entry document's inline ${b.kind} block (${b.bytes} B at bytes ${b.contentStart}-${b.contentEnd} of ${rel}) is indexed whole and never sliced.`,
        note: `whole-file (entry inline ${b.kind} block, not sliced)`,
        startLine: 1,
        endLine: lines.length,
        sourceFile: `readable/${prettyFile}`,
      });
      sources.push({
        sourceFile: `readable/${prettyFile}`,
        capture: rel,
        captureKind: `inline-${b.kind}`,
        captureByteStart: b.contentStart,
        captureByteEnd: b.contentEnd,
        captureSha256: b.sha256,
        captureBytes: b.bytes,
        prettyLines: lines.length,
        prettyBytes: Buffer.byteLength(pretty, "utf8"),
        tag,
        slices: 0,
        derived: "readable only (inline block, wholeFile)",
      });
    }
  }

  // ── 4) non-code payloads: hashed notRendered records (no pretty pass) ──
  const KIND_OF = [
    [/\.(png|jpe?g|webp|gif|svg|avif|ico)$/i, "image"],
    [/\.(mp4|webm)$/i, "video"],
    [/\.(mp3|ogg|wav|m4a)$/i, "audio"],
    [/\.(woff2?|ttf|otf)$/i, "font"],
  ];
  for (const rel of captured) {
    const kind = KIND_OF.find(([re]) => re.test(rel))?.[1];
    if (!kind) continue;
    const buf = captureBytes(rel);
    notRendered.push({
      capture: rel,
      kind,
      bytes: buf.length,
      sha256: manifest.files[rel].sha256,
      rendered: false,
      reason: `${kind} payload — binary capture stays byte-exact under .upstream/manifest.json; recorded here hashed, no pretty pass`,
    });
  }

  // ── 5) prune orphan derived files (capture untouched) ──────────────────
  let pruned = 0;
  for (const [dir, keep, exts] of [
    [readableDir, written.readable, /\.(pretty\.js|pretty\.css)$/],
    [srcDir, written.src, /\.js$/],
  ]) {
    for (const f of fs.readdirSync(dir)) {
      if (exts.test(f) && !keep.has(f)) {
        fs.rmSync(path.join(dir, f));
        pruned++;
        console.log(`derive: pruned orphan derived file ${path.join(path.basename(dir), f)}`);
      }
    }
  }

  // ── 6) split-spec.json (2-space indent + trailing newline) ─────────────
  const appJs = sources.filter((s) => s.derived.startsWith("readable +"));
  const vendorJsS = sources.filter((s) => /wholeFile region\(s\)$/.test(s.derived) && s.capture.endsWith(".js"));
  const cssSources = sources.filter((s) => s.sourceFile.endsWith(".pretty.css"));
  const spec = {
    project: "street-game",
    kind: "statement-aligned-slices",
    defaultFile: `src/${sections.find((s) => !s.wholeFile && !s.skipped).file}`,
    note:
      "STREET GAME (https://street-game.centro-datos-crudo.workers.dev/) is capture-class: a Vite " +
      "production build of the Spanish-language 3D street-marbles game served at the origin root by " +
      "Cloudflare Workers. §0.4 fork-over-mirror was checked on 2026-10-12 — neither the page nor its JS " +
      "references a public source repo (zero github.com/gitlab.com references in the capture; the credits " +
      "point to the X account @IAenCrudo, and GitHub searches for the project find nothing), so the mirror " +
      "stands. Derived pipeline: capture → pinned prettier 3.9.6 (module API, default options, single pass " +
      "verified idempotent — never the CLI: it respects .gitignore and can silently echo its input) → " +
      "readable/<name>.pretty.js|css per captured JS/CSS file (capture-root-relative name, nested dirs " +
      "flattened with __; every pretty provably NOT byte-identical to its capture source) → " +
      "statement-aligned slices src/<name>-NN.js of the app code (top-level declaration boundaries only, " +
      "~250-350 line windows; oversized single declarations stay whole) with an exact 2-line provenance " +
      "header. Every slice parses standalone under `node --input-type=module --check -` and round-trips " +
      "byte-exact to its recorded readable line range. Vendor rule — wholeFile sections, never sliced: the " +
      "Vite modulepreload polyfill opening the bundle, the bundled three.js core (everything before the " +
      "WebGLRenderer declaration, incl. the __THREE__ revision registration, geometries, materials and " +
      "ShaderLib) and the bundled three.js WebGLRenderer implementation. The minifier merged the app's " +
      "level-config declarators (q, cl, ll, ul, dl, fl, pl, ml, hl, gl, _l, vl) into the SAME top-level " +
      "VariableDeclaration as the WebGLRenderer class (`var sl = class {…}, q = {…}, …`): the `sl` class " +
      "declarator is the renderer-vendor wholeFile region, the app declarators are one explicit ranged " +
      "slice whose body is the exact declarator list text (a syntactically standalone comma-chain of " +
      "assignments, byte-exact against its readable range). Stylesheet rule — assets/index-BM9TqdBo.css " +
      "is wholeFile. Media/font/image payloads are notRendered records (bytes + sha256, no pretty pass). " +
      "Inline <script>/<style> scan: index.html references external chunks only — zero inline content " +
      "blocks, so there are no *-inline-N twins and no index-inline-map.json. Identifiers in src/ are the " +
      "bundle's own minified names — the rename campaign (PLAN §5) is recorded as an open task in " +
      "README.md, not claimed here. Capture bytes are untouched by everything above; re-cut with " +
      "`node tools/derive.mjs` after any capture refresh. `node tools/audit.js` is the gate.",
    renderOptions: {
      _default:
        "prettier 3.9.6, module API, default options, single pass (re-format verified idempotent at derive time) — never the CLI: it respects .gitignore and can silently echo its input",
      js: "parser babel, no plugins",
      css: "parser css, no plugins",
      json: "parser json, no plugins (inline importmap blocks, if any)",
    },
    source:
      `readable/: ${sources.filter((s) => s.sourceFile?.endsWith(".pretty.js")).length} JS pretties ` +
      `(${appJs.length} app chunk(s) sliced, ${vendorJsS.length} vendor wholeFile) + ` +
      `${cssSources.length} CSS pretties; ` +
      `src/: ${appJs.reduce((n, s) => n + s.slices, 0)} statement-aligned slices across ${appJs.length} app chunk(s); ` +
      `${sections.filter((s) => s.wholeFile).length} wholeFile section(s); ` +
      `capture: ${captured.length} files under .upstream/manifest.json; inline scan: ${inlineFiles.join(", ")} ` +
      `(0 inline content blocks); notRendered: ${notRendered.length} payload(s).`,
    inline: {
      scanned: inlineFiles,
      contentBlocks: 0,
      notRendered: notRendered.length,
      note:
        "no inline <script>/<style> content blocks in the captured entry document — external chunk references " +
        "only, so there are no *-inline-N twins and no readable/index-inline-map.json",
    },
    sources,
    sections,
    notRendered,
  };
  fs.writeFileSync(path.join(proj, "split-spec.json"), JSON.stringify(spec, null, 2) + "\n");

  // ── 7) self-check (tools/audit.js is the authoritative gate) ────────────
  let bad = 0;
  const bySource = new Map();
  for (const s of sections) {
    if (!bySource.has(s.sourceFile)) bySource.set(s.sourceFile, []);
    bySource.get(s.sourceFile).push(s);
  }
  for (const [sourceFile, list] of bySource) {
    const lines = readLines(path.join(proj, sourceFile));
    const sorted = [...list].sort((a, b) => a.startLine - b.startLine);
    if (sorted[0].startLine !== 1) {
      console.error(`TILING FAIL ${sourceFile}: starts at line ${sorted[0].startLine}`);
      bad++;
    }
    for (let i = 1; i < sorted.length; i++)
      if (sorted[i].startLine !== sorted[i - 1].endLine + 1) {
        console.error(`TILING FAIL ${sourceFile}: gap/overlap at ${sorted[i].file}`);
        bad++;
      }
    if (sorted[sorted.length - 1].endLine !== lines.length) {
      console.error(`TILING FAIL ${sourceFile}: does not reach EOF (${lines.length})`);
      bad++;
    }
  }
  let parsed = 0;
  let ranged = 0;
  let roundOK = 0;
  for (const s of sections) {
    if (s.wholeFile || s.skipped) continue;
    ranged++;
    const abs = path.join(srcDir, s.file);
    const text = fs.readFileSync(abs, "utf8");
    const nl2 = text.indexOf("\n", text.indexOf("\n") + 1);
    const body = text.slice(nl2 + 1);
    const expected = readLines(path.join(proj, s.sourceFile)).slice(s.startLine - 1, s.endLine).join("\n") + "\n";
    if (body !== expected) {
      console.error(`ROUND-TRIP FAIL ${s.file}`);
      bad++;
    } else roundOK++;
    if (!parses(text).ok) {
      console.error(`PARSE FAIL src/${s.file}`);
      bad++;
    } else parsed++;
  }
  let prettyParsed = 0;
  for (const s of sources) {
    if (!s.sourceFile?.endsWith(".pretty.js")) continue;
    if (!parses(fs.readFileSync(path.join(proj, s.sourceFile), "utf8")).ok) {
      console.error(`PARSE FAIL ${s.sourceFile}`);
      bad++;
    } else prettyParsed++;
  }
  console.log(
    `derive: ${written.readable.size} readable file(s), ${written.src.size} src slices ` +
      `(${parsed}/${ranged} parse standalone, ${roundOK}/${ranged} round-trip byte-exact), ` +
      `${sections.filter((s) => s.wholeFile).length} wholeFile, ` +
      `${prettyParsed} pretty js parse clean, ${notRendered.length} notRendered, ${pruned} orphan(s) pruned — ` +
      `self-check ${bad ? bad + " FAILURE(S)" : "clean"}`,
  );
  if (bad) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
