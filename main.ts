// One Emoji, One Dream Vacation — entry for make.fun bounty
// u-grand-elephant-19-one-emoji-one-dream-vacation-62879a35
//
// Writes exactly one emoji to $MAKEFUN_OUTPUT_DIR/entry.txt (or
// /output/entry.txt when the variable is not set):
//   U+1F305 SUNRISE — dawn breaking over the sea, the postcard moment
//   of a dream vacation. One code point, four UTF-8 bytes, no newline.

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const EMOJI = "🌅"; // U+1F305 SUNRISE

function main() {
  // Guard: exactly one code point (counted with [...str], not .length),
  // not whitespace only, no newline anywhere, and a short UTF-8 payload
  // (the gate allows 1-8 characters; fewer bytes also wins the tie-break).
  const points = [...EMOJI];
  if (points.length < 1 || points.length > 8) {
    throw new Error(`expected 1-8 code points, got ${points.length}`);
  }
  if (!/\S/.test(EMOJI)) {
    throw new Error("emoji must not be whitespace only");
  }
  if (EMOJI.includes("\n") || EMOJI.includes("\r")) {
    throw new Error("emoji must not contain a newline");
  }
  const bytes = Buffer.byteLength(EMOJI, "utf8");
  if (bytes < 1 || bytes > 32) {
    throw new Error(`unexpected UTF-8 byte length: ${bytes}`);
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, EMOJI, "utf8");

  // Round-trip self-check: read back and verify byte-identical.
  const back = readFileSync(outPath, "utf8");
  if (back !== EMOJI) {
    throw new Error("round-trip mismatch");
  }
}

main();
