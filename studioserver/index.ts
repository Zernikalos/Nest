// @ts-ignore
import express from "express"

export function startFileServer() {
    const app = express()
    const PORT = 3000

    app.get('/', (_req: express.Request, res: express.Response) => {
        res.send('Hello World!')
    })

    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`)
    })
}


startFileServer()
