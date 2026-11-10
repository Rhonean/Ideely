// Kopieert de webapp naar www/ voor de telefoon-app. De bron blijft index.html in de hoofdmap.
import fs from "fs";
import path from "path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..");
const out = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "www");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of ["index.html", "icon.svg", "icon-192.png", "icon-512.png"]) {
  fs.copyFileSync(path.join(root, f), path.join(out, f));
}
console.log("www klaar:", fs.readdirSync(out).join(", "));
