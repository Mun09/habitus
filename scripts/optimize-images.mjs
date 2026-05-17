import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join, parse } from "node:path";

const TARGETS = [
  { dir: "public/images/scenarios/random", maxWidth: 1600, quality: 78 },
  { dir: "public/images/design-demo", maxWidth: 1600, quality: 80 },
];

async function processDir({ dir, maxWidth, quality }) {
  const entries = await readdir(dir);
  for (const name of entries) {
    const ext = parse(name).ext.toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;
    const src = join(dir, name);
    const out = join(dir, parse(name).name + ".webp");
    const before = (await stat(src)).size;
    await sharp(src)
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality, effort: 5 })
      .toFile(out);
    const after = (await stat(out)).size;
    const pct = ((1 - after / before) * 100).toFixed(1);
    console.log(
      `${out}  ${(before / 1024 / 1024).toFixed(2)}MB → ${(
        after / 1024 / 1024
      ).toFixed(2)}MB  (-${pct}%)`
    );
  }
}

for (const t of TARGETS) {
  await processDir(t);
}
