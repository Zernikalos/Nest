"use strict";

const fs = require("fs");
const path = require("path");

const png = path.join(__dirname, "..", "electronapp", "assets", "icons", "zklogo.png");
const ico = path.join(__dirname, "..", "electronapp", "assets", "icons", "zklogo.ico");

// png-to-ico v3 is ESM-only; load it via dynamic import from this CJS script.
(async () => {
    const pngToIco = (await import("png-to-ico")).default;
    const buf = await pngToIco(png);
    fs.writeFileSync(ico, buf);
    console.log(`Wrote ${ico} (${buf.length} bytes)`);
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
