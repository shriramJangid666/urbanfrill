#!/usr/bin/env node
// tools/convert-images.js
// Simple Node script to convert JPEG/JPG images under public/images to WebP using sharp.

import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const ROOT = path.resolve(process.cwd());
const IMAGES_DIR = path.join(ROOT, "public", "images");
const QUALITY = 80;

async function findImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      const sub = await findImages(full);
      results.push(...sub);
    } else if (/\.jpe?g$/i.test(e.name)) {
      results.push(full);
    }
  }
  return results;
}

async function convert(file) {
  const parsed = path.parse(file);
  const out = path.join(parsed.dir, `${parsed.name}.webp`);
  await sharp(file).webp({ quality: QUALITY }).toFile(out);
  return out;
}

async function main() {
  try {
    const images = await findImages(IMAGES_DIR);
    if (!images.length) {
      console.log("No JPEG images found under public/images");
      return;
    }
    console.log(`Found ${images.length} JPEG(s). Converting to WebP (quality=${QUALITY})...`);
    for (const f of images) {
      const out = await convert(f);
      console.log(`Converted: ${path.relative(ROOT, f)} -> ${path.relative(ROOT, out)}`);
    }
    console.log("Done. If you want to remove original JPEGs, re-run with --delete");

    if (process.argv.includes("--delete") || process.argv.includes("--remove")) {
      for (const f of images) {
        await fs.unlink(f);
        console.log(`Deleted original: ${path.relative(ROOT, f)}`);
      }
      console.log("Original JPEG files removed.");
    }
  } catch (err) {
    console.error("Error converting images:", err);
    process.exit(1);
  }
}

main();
