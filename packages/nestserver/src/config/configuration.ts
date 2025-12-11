import * as process from "node:process";
import * as path from "path";

export default () => ({
    port: parseInt(process.env.PORT, 10) || 3002,
    shouldStartServer: process.env.START_SERVER === "true",
    settingsPath: process.env.SETTINGS_PATH || path.join(__dirname, '..', '..', 'db', 'settings.json')
});