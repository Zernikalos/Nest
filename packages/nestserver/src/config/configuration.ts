import * as process from "node:process";

export default () => ({
    port: parseInt(process.env.PORT, 10) || 3002,
    env: process.env.NODE_ENV
});