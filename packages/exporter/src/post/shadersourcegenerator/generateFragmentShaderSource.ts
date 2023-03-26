import {ZModel} from "../../zernikalos/ZModel";
import {ZAttributeKey} from "../../zernikalos/mesh/ZAttributeKey";
import {BR, buildSource, CLOSE_MAIN, FLOAT_PRECISSION, HEADER, OPEN_MAIN} from "./shadersourcecommon";
import {ANAME_OUT_FRAG_SHADER_COLOR, ANAME_IN_FRAG_SHADER_COLOR} from "../constants";

export function generateFragmentShaderSource(obj: ZModel) {
    const source: string[] = [
        HEADER,
        BR,
        FLOAT_PRECISSION,
        BR,
        ...genInAttributes(obj.mesh.attributeKeysMap),
        genOutAttributes(obj.mesh.attributeKeysMap),
        BR,
        OPEN_MAIN,
        genOutColor(obj.mesh.attributeKeysMap),
        CLOSE_MAIN
    ]

    return buildSource(source)
}

function genInAttributes(attributes: Map<string, ZAttributeKey>): string[] {
    function genAttribute(name: string): string {
        switch (name) {
            case "color":
                return `smooth in vec3 ${ANAME_IN_FRAG_SHADER_COLOR};`
        }
    }

    return [...attributes.entries()].map(([name, _]) => genAttribute(name))
}

function genOutAttributes(_attributes: Map<string, ZAttributeKey>) {
    return `out vec4 ${ANAME_OUT_FRAG_SHADER_COLOR};`
}

function genOutColor(attributes: Map<string, ZAttributeKey>) {
    if (attributes.has("color")) {
        return `${ANAME_OUT_FRAG_SHADER_COLOR} = vec4(${ANAME_IN_FRAG_SHADER_COLOR}.xyz, 1);`
    }
    return `${ANAME_OUT_FRAG_SHADER_COLOR} = vec4(0.5, 0.5, 0.5, 1.0);`
}
