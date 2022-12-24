
export default async function (file: File): Promise<string> {
    const content = await file.arrayBuffer()
    const decoder = new TextDecoder()
    return decoder.decode(content)
}
