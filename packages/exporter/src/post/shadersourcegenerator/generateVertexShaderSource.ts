import {ZModel} from "../../zernikalos/ZModel";
import {ZAttributeKey} from "../../zernikalos/mesh/ZAttributeKey";
import {
    ANAME_SHADER_POSITION,
    ANAME_SHADER_NORMAL,
    ANAME_SHADER_UV,
    UNAME_SHADER_MODEL_VIEW_MATRIX, ANAME_IN_VERT_SHADER_COLOR, ANAME_OUT_VERT_SHADER_COLOR, UNAME_SHADER_PROJECTION_MATRIX
} from "../constants";
import {
    BR, buildSource,
    CLOSE_MAIN,
    HEADER,
    OPEN_MAIN,
    T,
} from "./shadersourcecommon"

export function generateVertexShaderSource(obj: ZModel): string {
    const source: (string | string[])[] = [
        HEADER,
        BR,
        ...genUniforms(),
        ...genInAttributes(obj.mesh.attributeKeysMap),
        genOutAttributes(obj.mesh.attributeKeysMap),
        BR,
        OPEN_MAIN,
        [T, genOutPosition()],
        [T, genOutColor(obj.mesh.attributeKeysMap)],
        CLOSE_MAIN
    ]

    return buildSource(source)
}

function genInAttributes(attributes: Map<string, ZAttributeKey>): string[] {
    function genAttribute(name: string): string {
        switch (name) {
            case "position":
                return `in vec3 ${ANAME_SHADER_POSITION};`
            case "normal":
                return `in vec3 ${ANAME_SHADER_NORMAL};`
            case "uv":
                return `in vec2 ${ANAME_SHADER_UV};`
            case "color":
                return `in vec3 ${ANAME_IN_VERT_SHADER_COLOR};`
        }
    }

    return [...attributes.entries()].map(([name, _]) => genAttribute(name))
}

function genOutAttributes(attributes: Map<string, ZAttributeKey>) {
    if (!attributes.has("color")) {
        return ""
    }
    return `out vec3 ${ANAME_OUT_VERT_SHADER_COLOR};`
}

function genOutColor(attributes: Map<string, ZAttributeKey>) {
    if (!attributes.has("color")) {
        return ""
    }
    return `${ANAME_OUT_VERT_SHADER_COLOR} = ${ANAME_IN_VERT_SHADER_COLOR};`
}

function genUniforms(): string[] {
    return [
        `uniform mat4 ${UNAME_SHADER_MODEL_VIEW_MATRIX};`,
        `uniform mat4 ${UNAME_SHADER_PROJECTION_MATRIX};`
    ]
}

function genOutPosition() {
    return `gl_Position = ${UNAME_SHADER_PROJECTION_MATRIX} * ${UNAME_SHADER_MODEL_VIEW_MATRIX} * vec4(${ANAME_SHADER_POSITION},1);`
}

// const vertexShaderSource = `#version 300 es
//
// in vec4 a_position;
// uniform vec4 u_offset;
//
// void main() {
//   mat4 p = mat4(1.3737387097273113, 0, 0, 0, 0, 1.3844710433970557, 0, 0, 0, 0, -1.02020202020202, -1, 0, 0, -2.0202020202020203, 0);
//   mat4 v = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -6, 1);
//   mat4 m = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
//   gl_Position = p*v*m * (a_position + u_offset);
// }
// `
