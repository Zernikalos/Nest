export default () => ({
    port: parseInt(process.env.PORT || '3002', 10),
    shouldStartServer: process.env.START_SERVER === "true"
});