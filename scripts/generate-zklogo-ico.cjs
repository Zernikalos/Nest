"use strict";

const fs = require("fs");
const path = require("path");

const png = path.join(__dirname, "..", "electronapp", "assets", "icons", "zklogo.png");
const ico = path.join(__dirname, "..", "electronapp", "assets", "icons", "zklogo.ico");

// Run via: pnpm exec --package png-to-ico node scripts/generate-zklogo-ico.cjs
const pngToIco = require("png-to-ico");

pngToIco(png)
    .then((buf) => {
        fs.writeFileSync(ico, buf);
        console.log(`Wrote ${ico} (${buf.length} bytes)`);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
