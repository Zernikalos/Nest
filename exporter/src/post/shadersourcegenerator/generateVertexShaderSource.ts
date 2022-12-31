import {MrModel} from "../../mrr/MrModel";
import {MrAttributeKey} from "../../mrr/mesh/MrAttributeKey";
import {
    ANAME_NORMAL,
    ANAME_POSITION,
    ANAME_UV,
    UNAME_MVP_MATRIX
} from "../common";
import {
    BR,
    CLOSE_MAIN,
    HEADER,
    l,
    OPEN_MAIN,
    T,
} from "./shadersourcecommon"

export function generateVertexShaderSource(obj: MrModel): string {
    const source = [
        HEADER,
        BR,
        ...genUniforms(),
        ...genAttributes(obj.mesh.attributeKeys),
        BR,
        OPEN_MAIN,
        [T, genOutPosition()],
        CLOSE_MAIN
    ]

    return source.flatMap((e) => {
        if (Array.isArray(e)) {
            return e.join('')
        }
        return e
    }).map(l).join('')
}

function genAttributes(attributes: Map<string, MrAttributeKey>): string[] {
    function genAttribute(name: string): string {
        switch (name) {
            case "position":
                return `in vec3 ${ANAME_POSITION};`
            case "normal":
                return `in vec3 ${ANAME_NORMAL};`
            case "uv":
                return `in vec2 ${ANAME_UV};`
        }
    }

    return [...attributes.entries()].map(([name, _]) => genAttribute(name))
}

function genUniforms(): string[] {
    return [`uniform mat4 ${UNAME_MVP_MATRIX};`]
}

function genOutPosition() {
    return `gl_Position = mat4(1.3737387097273113, 0, 0, 0, 0, 1.3844710433970557, 0, 0, 0, 0, -1.02020202020202, -1, 0, 0, -2.0202020202020203, 0) * ${UNAME_MVP_MATRIX} * vec4(${ANAME_POSITION},1);`
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
