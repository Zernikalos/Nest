import {Group} from "three"
import {MrGroup} from "../mrr/MrGroup"

export function parseGroup(obj: Group) {
    const group = new MrGroup()
    group.name = obj.name
    return group
}
