import { MrRenderingContext } from "../ui/MrRenderingContext";
import { MrComponent, MrComponentData, MrComponentView } from "./MrComponent";

export class MrShaderProgram extends MrComponent {

    protected data: MrShaderProgramData;
    protected view: MrShaderProgramView;

    constructor(
        name: string,
        ctx: MrRenderingContext,
        vertexShaderSource: string,
        fragmentShaderSource: string,
        attributes?: MrAttribute[]) {
        super(name, ctx);
        this.data = new MrShaderProgramData(vertexShaderSource, fragmentShaderSource, attributes);
        this.view = new MrShaderProgramView();
    }

}

class MrShaderProgramData extends MrComponentData {

    public readonly attributes: Map<string, MrAttribute>;
    public readonly vertexShader: MrShader;
    public readonly fragmentShader: MrShader;
    public program: WebGLProgram = -1;

    constructor(
        vertexShaderSource: string,
        fragmentShaderSource: string,
        attributes?: MrAttribute[]) {
        super();
        this.attributes = new Map();
        this.vertexShader = new MrShader(MrShaderType.VERTEX_SHADER, vertexShaderSource);
        this.fragmentShader = new MrShader(MrShaderType.FRAGMENT_SHADER, fragmentShaderSource);
        if (attributes) {
            attributes.forEach((attr) => this.attributes.set(attr.name, attr));
        }
    }

}

class MrShaderProgramView extends MrComponentView {

    public initialize(ctx: MrRenderingContext, data: MrShaderProgramData) {
        const gl = ctx.gl;

        this.initializeShader(ctx, data.vertexShader);
        this.initializeShader(ctx, data.fragmentShader);

        const program = gl.createProgram();
        if (!program) {
            throw new Error("Unable to create program");
        }
        gl.attachShader(program, data.vertexShader.shader);
        gl.attachShader(program, data.fragmentShader.shader);

        for (const attr of data.attributes.values()) {
            gl.bindAttribLocation(program, attr.index, attr.name);
        }

        gl.linkProgram(program);
        data.program = program;
    }

    public bind(ctx: MrRenderingContext, data: MrShaderProgramData) {
        const gl = ctx.gl;
        gl.useProgram(data.program);
    }

    private initializeShader(ctx: MrRenderingContext, mrShader: MrShader) {
        const gl = ctx.gl;
        const shader = gl.createShader(mrShader.type);
        if (!shader) {
            throw new Error("Error creating shader");
        }
        gl.shaderSource(shader, mrShader.source);
        gl.compileShader(shader);

        const compileStatus = gl.getShaderInfoLog(shader);
        const compileError = gl.getError();
        if (compileStatus && compileError) {
            gl.deleteShader(shader);
            throw new Error("Error compiling shader");
        }
        mrShader.shader = shader;
    }

}

export const enum MrAttributeType {
    VERTICES,
    NORMALS,
    COLOR,
    MATERIAL_INDEX,
    TEXTURE,
    WEIGHT,
    BONE_INDICES,
}
class MrAttribute {

    constructor(public readonly index: number, public readonly type: MrAttributeType,  public readonly name: string) {

    }

}

enum MrShaderType {
    VERTEX_SHADER = WebGL2RenderingContext.VERTEX_SHADER,
    FRAGMENT_SHADER = WebGL2RenderingContext.FRAGMENT_SHADER,
}
class MrShader {

    public shader: WebGLShader = -1;

    constructor(public readonly type: MrShaderType, public readonly source: string) {

    }
}
