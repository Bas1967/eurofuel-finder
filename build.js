const fs = require("fs");
const path = require("path");

const files = [
  "index.html",
  "app.js",
  "manifest.webmanifest",
  "icon.svg",
  "sw.js"
];

const out = path.join(__dirname, "www");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const file of files) {
  const source = path.join(__dirname, file);
  if (!fs.existsSync(source)) {
    throw new Error("Ontbrekend app-bestand: " + file);
  }
  fs.copyFileSync(source, path.join(out, file));
}

console.log("EuroFuel Finder webbestanden klaargezet voor Android.");
