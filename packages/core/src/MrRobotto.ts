import { MrDataType, MrDrawMode, MrMesh } from "./engine/MrMesh";
import { MrAttributeType, MrShaderProgram} from "./engine/MrShaderProgram";
import { MrRenderingContext } from "./ui/MrRenderingContext";

const vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;

// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
`;

const fragmentShaderSource = `#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  // Just set the output to a constant redish-purple
  outColor = vec4(1, 0, 0.5, 1);
}
`;

export class MrRobotto {

    private _gl!: WebGLRenderingContext;

    public initialize(canvas: HTMLCanvasElement) {
        const renderingCtx = new MrRenderingContext(canvas);

        if (!renderingCtx.gl) {
            throw new Error("Unable to start a GL context");
        }

        this._gl = renderingCtx.gl;

        const attributes = [{index: 0, type: MrAttributeType.VERTICES, name: "a_position"}];
        const program = new MrShaderProgram(
          "basic-shader",
          renderingCtx,
          vertexShaderSource,
          fragmentShaderSource,
          attributes);

        program.initialize();
        // look up where the vertex data needs to go.
        const positions = [
            0, 0,
            0, 0.5,
            0.7, 0,
        ];

        const keys = [{
          attributeType: MrAttributeType.VERTICES,
          dataType: MrDataType.FLOAT,
          size: 2,
          stride: 0,
          pointer: 0,
        }];
        const mesh = new MrMesh(
          "triangle",
          renderingCtx,
          {drawMode: MrDrawMode.TRIANGLES, count: 3},
          keys,
          [],
          positions);
        mesh.initialize();

        this.resizeCanvas(this._gl.canvas as HTMLCanvasElement);

        this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);

        this._gl.clearColor(0, 0, 0, 0);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);

        program.bind();

        mesh.bind();

        mesh.draw();
    }

    private resizeCanvas(canvas: HTMLCanvasElement, multiplier?: number) {
        multiplier = multiplier || 1;
        const width  = canvas.clientWidth  * multiplier | 0;
        const height = canvas.clientHeight * multiplier | 0;
        if (canvas.width !== width ||  canvas.height !== height) {
          canvas.width  = width;
          canvas.height = height;
          return true;
        }
        return false;
    }
}
