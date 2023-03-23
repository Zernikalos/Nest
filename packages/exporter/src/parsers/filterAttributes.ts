import {BufferGeometry} from "three";
import {ATTRIB_THREE_TO_ZKO} from "../constants";
import _ from "lodash";

/**
 * Filters only recognized attributes by the parser
 * @param geometry
 */
export function filterAttributes(geometry: BufferGeometry) {
    return Object.entries(geometry.attributes).filter(([key, _attr]) => !_.isNil(ATTRIB_THREE_TO_ZKO[key]))
}
