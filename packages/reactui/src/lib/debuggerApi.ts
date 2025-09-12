import { api } from "@/lib/httpClient"

// Get debug key
export async function getDebugKey(): Promise<string> {
    const response = await api.get("/nest/key")
    return response.data
}
