import * as $protobuf from "protobufjs";
import Long = require("long");
export namespace Mrr {

    interface IProtoMrObject {
        type: string;
        group?: (Mrr.IMrGroup|null);
        model?: (Mrr.IMrModel|null);
        scene?: (Mrr.IMrScene|null);
        children?: (Mrr.IProtoMrObject[]|null);
    }

    class ProtoMrObject implements IProtoMrObject {
        constructor(properties?: Mrr.IProtoMrObject);
        public type: string;
        public group?: (Mrr.IMrGroup|null);
        public model?: (Mrr.IMrModel|null);
        public scene?: (Mrr.IMrScene|null);
        public children: Mrr.IProtoMrObject[];
        public static create(properties?: Mrr.IProtoMrObject): Mrr.ProtoMrObject;
        public static encode(message: Mrr.IProtoMrObject, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Mrr.IProtoMrObject, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mrr.ProtoMrObject;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Mrr.ProtoMrObject;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Mrr.ProtoMrObject;
        public static toObject(message: Mrr.ProtoMrObject, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMrGroup {
        name: string;
        transform: Mrr.IMrTransform;
    }

    class MrGroup implements IMrGroup {
        constructor(properties?: Mrr.IMrGroup);
        public name: string;
        public transform: Mrr.IMrTransform;
        public static create(properties?: Mrr.IMrGroup): Mrr.MrGroup;
        public static encode(message: Mrr.IMrGroup, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Mrr.IMrGroup, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mrr.MrGroup;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Mrr.MrGroup;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Mrr.MrGroup;
        public static toObject(message: Mrr.MrGroup, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMrColor {
        r: number;
        g: number;
        b: number;
        a: number;
    }

    class MrColor implements IMrColor {
        constructor(properties?: Mrr.IMrColor);
        public r: number;
        public g: number;
        public b: number;
        public a: number;
        public static create(properties?: Mrr.IMrColor): Mrr.MrColor;
        public static encode(message: Mrr.IMrColor, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Mrr.IMrColor, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mrr.MrColor;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Mrr.MrColor;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Mrr.MrColor;
        public static toObject(message: Mrr.MrColor, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMrScene {
        name: string;
        transform: Mrr.IMrTransform;
        clearColor: Mrr.IMrColor;
    }

    class MrScene implements IMrScene {
        constructor(properties?: Mrr.IMrScene);
        public name: string;
        public transform: Mrr.IMrTransform;
        public clearColor: Mrr.IMrColor;
        public static create(properties?: Mrr.IMrScene): Mrr.MrScene;
        public static encode(message: Mrr.IMrScene, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Mrr.IMrScene, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mrr.MrScene;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Mrr.MrScene;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Mrr.MrScene;
        public static toObject(message: Mrr.MrScene, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMrTransform {
        location: Mrr.IMrVector3;
        rotation: Mrr.IMrQuaternion;
        scale: Mrr.IMrVector3;
    }

    class MrTransform implements IMrTransform {
        constructor(properties?: Mrr.IMrTransform);
        public location: Mrr.IMrVector3;
        public rotation: Mrr.IMrQuaternion;
        public scale: Mrr.IMrVector3;
        public static create(properties?: Mrr.IMrTransform): Mrr.MrTransform;
        public static encode(message: Mrr.IMrTransform, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Mrr.IMrTransform, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mrr.MrTransform;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Mrr.MrTransform;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Mrr.MrTransform;
        public static toObject(message: Mrr.MrTransform, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMrVector3 {
        x: number;
        y: number;
        z: number;
    }

    class MrVector3 implements IMrVector3 {
        constructor(properties?: Mrr.IMrVector3);
        public x: number;
        public y: number;
        public z: number;
        public static create(properties?: Mrr.IMrVector3): Mrr.MrVector3;
        public static encode(message: Mrr.IMrVector3, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Mrr.IMrVector3, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mrr.MrVector3;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Mrr.MrVector3;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Mrr.MrVector3;
        public static toObject(message: Mrr.MrVector3, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMrVector4 {
        x: number;
        y: number;
        z: number;
        w: number;
    }

    class MrVector4 implements IMrVector4 {
        constructor(properties?: Mrr.IMrVector4);
        public x: number;
        public y: number;
        public z: number;
        public w: number;
        public static create(properties?: Mrr.IMrVector4): Mrr.MrVector4;
        public static encode(message: Mrr.IMrVector4, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Mrr.IMrVector4, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mrr.MrVector4;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Mrr.MrVector4;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Mrr.MrVector4;
        public static toObject(message: Mrr.MrVector4, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMrQuaternion {
        w: number;
        x: number;
        y: number;
        z: number;
    }

    class MrQuaternion implements IMrQuaternion {
        constructor(properties?: Mrr.IMrQuaternion);
        public w: number;
        public x: number;
        public y: number;
        public z: number;
        public static create(properties?: Mrr.IMrQuaternion): Mrr.MrQuaternion;
        public static encode(message: Mrr.IMrQuaternion, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Mrr.IMrQuaternion, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mrr.MrQuaternion;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Mrr.MrQuaternion;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Mrr.MrQuaternion;
        public static toObject(message: Mrr.MrQuaternion, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMrModel {
        name: string;
        transform: Mrr.IMrTransform;
        shaderProgram: Mrr.IMrShaderProgram;
        mesh: Mrr.IMrMesh;
    }

    class MrModel implements IMrModel {
        constructor(properties?: Mrr.IMrModel);
        public name: string;
        public transform: Mrr.IMrTransform;
        public shaderProgram: Mrr.IMrShaderProgram;
        public mesh: Mrr.IMrMesh;
        public static create(properties?: Mrr.IMrModel): Mrr.MrModel;
        public static encode(message: Mrr.IMrModel, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Mrr.IMrModel, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mrr.MrModel;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Mrr.MrModel;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Mrr.MrModel;
        public static toObject(message: Mrr.MrModel, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMrMesh {
        attributeKeys?: ({ [k: string]: Mrr.IMrAttributeKey }|null);
        indices: Mrr.IMrIndexBuffer;
        vertices?: ({ [k: string]: Mrr.IMrVertexBuffer }|null);
    }

    class MrMesh implements IMrMesh {
        constructor(properties?: Mrr.IMrMesh);
        public attributeKeys: { [k: string]: Mrr.IMrAttributeKey };
        public indices: Mrr.IMrIndexBuffer;
        public vertices: { [k: string]: Mrr.IMrVertexBuffer };
        public static create(properties?: Mrr.IMrMesh): Mrr.MrMesh;
        public static encode(message: Mrr.IMrMesh, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Mrr.IMrMesh, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mrr.MrMesh;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Mrr.MrMesh;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Mrr.MrMesh;
        public static toObject(message: Mrr.MrMesh, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMrAttributeKey {
        index: number;
        size: number;
        count: number;
        normalized: boolean;
        offset: number;
        stride: number;
    }

    class MrAttributeKey implements IMrAttributeKey {
        constructor(properties?: Mrr.IMrAttributeKey);
        public index: number;
        public size: number;
        public count: number;
        public normalized: boolean;
        public offset: number;
        public stride: number;
        public static create(properties?: Mrr.IMrAttributeKey): Mrr.MrAttributeKey;
        public static encode(message: Mrr.IMrAttributeKey, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Mrr.IMrAttributeKey, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mrr.MrAttributeKey;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Mrr.MrAttributeKey;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Mrr.MrAttributeKey;
        public static toObject(message: Mrr.MrAttributeKey, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    enum BufferTargetType {
        ARRAY_BUFFER = 0,
        ELEMENT_ARRAY_BUFFER = 1
    }

    enum BufferUsageType {
        STATIC_DRAW = 0
    }

    interface IMrIndexBuffer {
        targetBuffer: Mrr.BufferTargetType;
        usage: Mrr.BufferUsageType;
        itemSize: number;
        count: number;
        dataArray: Uint8Array;
    }

    class MrIndexBuffer implements IMrIndexBuffer {
        constructor(properties?: Mrr.IMrIndexBuffer);
        public targetBuffer: Mrr.BufferTargetType;
        public usage: Mrr.BufferUsageType;
        public itemSize: number;
        public count: number;
        public dataArray: Uint8Array;
        public static create(properties?: Mrr.IMrIndexBuffer): Mrr.MrIndexBuffer;
        public static encode(message: Mrr.IMrIndexBuffer, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Mrr.IMrIndexBuffer, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mrr.MrIndexBuffer;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Mrr.MrIndexBuffer;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Mrr.MrIndexBuffer;
        public static toObject(message: Mrr.MrIndexBuffer, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMrVertexBuffer {
        targetBuffer: Mrr.BufferTargetType;
        usage: Mrr.BufferUsageType;
        itemSize: number;
        count: number;
        dataArray: Uint8Array;
    }

    class MrVertexBuffer implements IMrVertexBuffer {
        constructor(properties?: Mrr.IMrVertexBuffer);
        public targetBuffer: Mrr.BufferTargetType;
        public usage: Mrr.BufferUsageType;
        public itemSize: number;
        public count: number;
        public dataArray: Uint8Array;
        public static create(properties?: Mrr.IMrVertexBuffer): Mrr.MrVertexBuffer;
        public static encode(message: Mrr.IMrVertexBuffer, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Mrr.IMrVertexBuffer, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mrr.MrVertexBuffer;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Mrr.MrVertexBuffer;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Mrr.MrVertexBuffer;
        public static toObject(message: Mrr.MrVertexBuffer, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMrShaderProgram {
        vertexShader: Mrr.IMrShader;
        fragmentShader: Mrr.IMrShader;
        attributes?: ({ [k: string]: Mrr.IMrShaderAttribute }|null);
        uniforms?: ({ [k: string]: Mrr.IMrShaderUniform }|null);
    }

    class MrShaderProgram implements IMrShaderProgram {
        constructor(properties?: Mrr.IMrShaderProgram);
        public vertexShader: Mrr.IMrShader;
        public fragmentShader: Mrr.IMrShader;
        public attributes: { [k: string]: Mrr.IMrShaderAttribute };
        public uniforms: { [k: string]: Mrr.IMrShaderUniform };
        public static create(properties?: Mrr.IMrShaderProgram): Mrr.MrShaderProgram;
        public static encode(message: Mrr.IMrShaderProgram, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Mrr.IMrShaderProgram, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mrr.MrShaderProgram;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Mrr.MrShaderProgram;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Mrr.MrShaderProgram;
        public static toObject(message: Mrr.MrShaderProgram, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMrShader {
        type: string;
        source: string;
    }

    class MrShader implements IMrShader {
        constructor(properties?: Mrr.IMrShader);
        public type: string;
        public source: string;
        public static create(properties?: Mrr.IMrShader): Mrr.MrShader;
        public static encode(message: Mrr.IMrShader, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Mrr.IMrShader, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mrr.MrShader;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Mrr.MrShader;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Mrr.MrShader;
        public static toObject(message: Mrr.MrShader, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMrShaderAttribute {
        index: number;
        attributeName: string;
    }

    class MrShaderAttribute implements IMrShaderAttribute {
        constructor(properties?: Mrr.IMrShaderAttribute);
        public index: number;
        public attributeName: string;
        public static create(properties?: Mrr.IMrShaderAttribute): Mrr.MrShaderAttribute;
        public static encode(message: Mrr.IMrShaderAttribute, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Mrr.IMrShaderAttribute, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mrr.MrShaderAttribute;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Mrr.MrShaderAttribute;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Mrr.MrShaderAttribute;
        public static toObject(message: Mrr.MrShaderAttribute, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IMrShaderUniform {
        uniformName: string;
        count: number;
        type: Mrr.MrUniformType;
    }

    class MrShaderUniform implements IMrShaderUniform {
        constructor(properties?: Mrr.IMrShaderUniform);
        public uniformName: string;
        public count: number;
        public type: Mrr.MrUniformType;
        public static create(properties?: Mrr.IMrShaderUniform): Mrr.MrShaderUniform;
        public static encode(message: Mrr.IMrShaderUniform, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Mrr.IMrShaderUniform, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Mrr.MrShaderUniform;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Mrr.MrShaderUniform;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Mrr.MrShaderUniform;
        public static toObject(message: Mrr.MrShaderUniform, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    enum MrUniformType {
        SCALAR = 0,
        VEC2 = 1,
        VEC3 = 2,
        VEC4 = 3,
        MAT2 = 4,
        MAT3 = 5,
        MAT4 = 6
    }
}
