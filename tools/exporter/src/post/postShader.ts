import {MrShader, ShaderType} from "../mrr/MrShader";

export function postShader(type: ShaderType): MrShader {
    const shader = new MrShader()
    shader.type = type
    if (type === "vertex") {
        shader.source = vertexShaderSource
    } else {
        shader.source = fragmentShaderSource
    }
    return shader
}

const vertexShaderSource = `#version 300 es

in vec4 a_position;
uniform vec4 u_offset;

void main() {
  mat4 p = mat4(1.3737387097273113, 0, 0, 0, 0, 1.3844710433970557, 0, 0, 0, 0, -1.02020202020202, -1, 0, 0, -2.0202020202020203, 0);
  mat4 v = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -6, 1);
  mat4 m = mat4(-0.24608959655537704, 0.8207303996723887, 0.5155982171427886, 0, -0.9688824099139265, -0.22289419717298997, -0.10763388233266194, 0, 0.02658545140868853, -0.5260416218515593, 0.8500431905810325, 0, 0, 0, 0, 1);
  gl_Position = p*v*m * (a_position + u_offset);
}
`;

const fragmentShaderSource = `#version 300 es

precision mediump float;

out vec4 outColor;

void main() {
  outColor = vec4(0.5, 0.5, 0.5, 1);
}
`;
