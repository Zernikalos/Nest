import axios from "axios";

const client = axios.create({
    // @ts-ignore
    baseURL: import.meta.env.VITE_STUDIO_SERVER_HOST
})

export default client
