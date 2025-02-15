import * as process from "node:process";

export default () => ({
    port: parseInt(process.env.PORT, 10) || 3002,
    shouldStartServer: process.env.START_SERVER === "true"
});