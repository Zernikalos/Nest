import { MrDataType } from "./engine/constants";
import { MrAttribute } from "./engine/MrAttribute";
import { MrMesh } from "./engine/MrMesh";
import { MrShaderProgram} from "./engine/MrShaderProgram";
import { MrRenderingContext } from "./ui/MrRenderingContext";

const vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;

// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  mat4 p = mat4(1.3737387097273113, 0, 0, 0, 0, 1.3844710433970557, 0, 0, 0, 0, -1.02020202020202, -1, 0, 0, -2.0202020202020203, 0);
  mat4 v = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -6, 1);
  mat4 m = mat4(-0.24608959655537704, 0.8207303996723887, 0.5155982171427886, 0, -0.9688824099139265, -0.22289419717298997, -0.10763388233266194, 0, 0.02658545140868853, -0.5260416218515593, 0.8500431905810325, 0, 0, 0, 0, 1);
  gl_Position = p*v*m * a_position;
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
  outColor = vec4(0.5, 0.5, 0.5, 1);
}
`;

const fragmentShaderSource2 = `#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  // Just set the output to a constant redish-purple
  outColor = vec4(0, 0, 0.5, 1);
}
`;

const vertices = [
  // Front face
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,

  // Back face
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0, -1.0, -1.0,

  // Top face
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,

  // Bottom face
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,

  // Right face
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,

  // Left face
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0,
];

const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];

const indices2 = [
    0,  1,  2,  3,    // front
    4,  5,  6,  7,    // back
    8,  9,  10, 11,   // top
    12, 13, 14, 15,   // bottom
    16, 17, 18, 19,   // right
    20, 21, 22, 23,   // left
    23, 6,
  ];

export class MrRobotto {

    public initialize(canvas: HTMLCanvasElement) {
        const ctx = new MrRenderingContext(canvas);

        /* function get_projection(angle: number, a: number, zMin: number, zMax: number) {
          const ang = Math.tan((angle * .5) * Math.PI / 180);
          return [
             0.5 / ang, 0 , 0, 0,
             0, 0.5 * a / ang, 0, 0,
             0, 0, -(zMax + zMin) / (zMax - zMin), -1,
             0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0,
          ];
       } */

        this.resizeCanvas(ctx.gl.canvas as HTMLCanvasElement);

        if (!ctx.gl) {
            throw new Error("Unable to start a GL context");
        }

        const attributes = [{index: 0, type: MrAttribute.Type.VERTICES, attrName: "a_position"}];
        const program = new MrShaderProgram(
          ctx,
          {
            vertexShaderSource,
            fragmentShaderSource,
            attributes,
          });

        const program2 = new MrShaderProgram(
          ctx,
          {
            vertexShaderSource,
            fragmentShaderSource: fragmentShaderSource2,
            attributes,
          });

        program.initialize();
        program2.initialize();

        const bufferIndices = [{
          index: MrAttribute.Type.VERTICES,
          dataType: MrDataType.FLOAT,
          size: 3,
          stride: 0,
          pointer: 0,
        }];

        const mesh = new MrMesh(
          ctx,
          {
            drawMode: MrMesh.DrawMode.TRIANGLES,
            numFaces: 36,
            bufferIndices,
            indexBufferDataArray: indices,
            vertexBufferDataArray: vertices,
          });

        const mesh2 = new MrMesh(
          ctx,
          {
            drawMode: MrMesh.DrawMode.LINES,
            numFaces: indices2.length,
            bufferIndices,
            indexBufferDataArray: indices2,
            vertexBufferDataArray: vertices,
          });
        mesh.initialize();
        mesh2.initialize();

        ctx.gl.viewport(0, 0, ctx.gl.canvas.width, ctx.gl.canvas.height);

        ctx.gl.clearColor(0, 0, 0, 0);
        ctx.gl.clear(ctx.gl.COLOR_BUFFER_BIT);

        program.render();
        mesh.render();

        program2.render();
        mesh2.render();
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
