import {Group} from "three"
import {ZkGroup} from "../zko/ZkGroup"

export function parseGroup(_obj: Group) {
    const group = new ZkGroup()
    return group
}
