import { MrRenderingContext } from "../ui/MrRenderingContext";
import { MrAttribute } from "./MrAttribute";
import { MrComponent } from "./MrComponent";
import { MrProgram } from "./MrProgram";
import { MrShader } from "./MrShader";
import { MrUniform } from './MrUniform';

export class MrShaderProgram extends MrComponent {

    public readonly data: MrShaderProgram.Data;

    constructor(
        ctx: MrRenderingContext,
        data: {
            attributes?: MrAttribute.Data[],
            uniforms?: MrUniform.Data[],
            vertexShaderSource: string,
            fragmentShaderSource: string,
        }) {
            super(ctx);

            const program = new MrProgram(ctx);
            const vertexShader = new MrShader(ctx, {
                source: data.vertexShaderSource,
                type: MrShader.Type.VERTEX_SHADER,
            });
            const fragmentShader = new MrShader(ctx, {
                source: data.fragmentShaderSource,
                type: MrShader.Type.FRAGMENT_SHADER,
            });
            const attributes = [];
            if (data.attributes) {
                for (const attr of data.attributes) {
                    const mrAttr = new MrAttribute(ctx, attr);
                    attributes.push(mrAttr);
                }
            }
            const uniforms = [];
            if (data.uniforms) {
                for (const uniform of data.uniforms) {
                    const mrUniform = new MrUniform(ctx, uniform);
                    uniforms.push(mrUniform);
                }
            }
            this.data = {
                program,
                attributes,
                uniforms,
                vertexShader,
                fragmentShader,
            };
        }

    public initialize(): void {
        this.data.program.initialize();
        const programData = this.data.program.data;

        this.data.vertexShader.initialize(programData);
        this.data.fragmentShader.initialize(programData);
        for (const attr of this.data.attributes) {
            attr.initialize(programData);
        }
        this.data.program.link();
        for (const unif of this.data.uniforms) {
            unif.initialize(programData);
        }
    }

    public render() {
        this.data.program.render();
        for (const unif of this.data.uniforms) {
            unif.render();
        }
    }

}

export namespace MrShaderProgram {
    export interface Data {
        program: MrProgram;
        attributes: MrAttribute[];
        uniforms: MrUniform[];
        vertexShader: MrShader;
        fragmentShader: MrShader;
    }
}
