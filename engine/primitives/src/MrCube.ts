import { MrDataType, MrMesh, MrRenderingContext, MrShaderProgram } from "@mrrobotto/components";
import { MrModel } from "@mrrobotto/objects";

export class MrCube extends MrModel {
    private static vertexShaderSource = `#version 300 es

    // an attribute is an input (in) to a vertex shader.
    // It will receive data from a buffer
    in vec4 a_position;
    uniform vec4 u_offset;

    // all shaders have a main function
    void main() {
        // gl_Position is a special variable a vertex shader
        // is responsible for setting
        mat4 p = mat4(1.3737387097273113, 0, 0, 0, 0, 1.3844710433970557, 0, 0, 0, 0, -1.02020202020202, -1, 0, 0, -2.0202020202020203, 0);
        mat4 v = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -6, 1);
        mat4 m = mat4(-0.24608959655537704, 0.8207303996723887, 0.5155982171427886, 0, -0.9688824099139265, -0.22289419717298997, -0.10763388233266194, 0, 0.02658545140868853, -0.5260416218515593, 0.8500431905810325, 0, 0, 0, 0, 1);
        gl_Position = p*v*m * (a_position + u_offset);
    }
    `;

    private static fragmentShaderSource = `#version 300 es

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

    private static attributes = [{ index: 0, attrName: "a_position" }];

    private static uniforms = [{ uniformName: "u_offset", dataType: MrDataType.FLOAT }];

    private static vertices = [
    // front
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    // back
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
    ];

    private static indices = [
    // front
    0, 1, 2,
    2, 3, 0,
    // right
    1, 5, 6,
    6, 2, 1,
    // back
    7, 6, 5,
    5, 4, 7,
    // left
    4, 0, 3,
    3, 7, 4,
    // bottom
    4, 5, 1,
    1, 0, 4,
    // top
    3, 2, 6,
    6, 7, 3,
    ];

    private static buildMesh(ctx: MrRenderingContext) {
        return new MrMesh(ctx, {
            drawMode: MrMesh.DrawMode.TRIANGLES,
            numFaces: 12,
            indexBufferData: {
                array: MrCube.indices,
            },
            vertexBufferData: {
                array: MrCube.vertices,
                keys: [{
                    index: 0,
                    dataType: MrDataType.FLOAT,
                    size: 3,
                    stride: 0,
                    pointer: 0,
                }],
            },
        });
    }

    private static buildShaderProgram(ctx: MrRenderingContext) {
        return new MrShaderProgram(ctx, {
            fragmentShaderSource: MrCube.fragmentShaderSource,
            vertexShaderSource: MrCube.vertexShaderSource,
            attributes: MrCube.attributes,
            uniforms: MrCube.uniforms,
        });
    }

    constructor(ctx: MrRenderingContext) {
        super({
            mesh: MrCube.buildMesh(ctx),
            program: MrCube.buildShaderProgram(ctx),
        });
    }

    public initialize(): void {
        this.data.program.initialize();
        this.data.mesh.initialize();
    }

    public render(): void {
        this.data.program.render();
        this.data.mesh.render();
    }
}
