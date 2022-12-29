export type MrObjectType = "Object" | "Model" | "Group"

export class MrObject {
    type: MrObjectType = "Object"
    name = ""
    children: MrObject[] = []
}
