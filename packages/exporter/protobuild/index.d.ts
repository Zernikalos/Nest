import * as $protobuf from "protobufjs";
// import Long = require("long");
export namespace Zko {

    interface IProtoZkObject {
        type: string;
        group?: (Zko.IZkGroup|null);
        model?: (Zko.IZkModel|null);
        scene?: (Zko.IZkScene|null);
        children?: (Zko.IProtoZkObject[]|null);
    }

    class ProtoZkObject implements IProtoZkObject {
        constructor(properties?: Zko.IProtoZkObject);
        public type: string;
        public group?: (Zko.IZkGroup|null);
        public model?: (Zko.IZkModel|null);
        public scene?: (Zko.IZkScene|null);
        public children: Zko.IProtoZkObject[];
        public static create(properties?: Zko.IProtoZkObject): Zko.ProtoZkObject;
        public static encode(message: Zko.IProtoZkObject, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Zko.IProtoZkObject, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Zko.ProtoZkObject;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Zko.ProtoZkObject;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Zko.ProtoZkObject;
        public static toObject(message: Zko.ProtoZkObject, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IZkGroup {
        id: string;
        name: string;
        transform: Zko.IZkTransform;
    }

    class ZkGroup implements IZkGroup {
        constructor(properties?: Zko.IZkGroup);
        public id: string;
        public name: string;
        public transform: Zko.IZkTransform;
        public static create(properties?: Zko.IZkGroup): Zko.ZkGroup;
        public static encode(message: Zko.IZkGroup, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Zko.IZkGroup, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Zko.ZkGroup;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Zko.ZkGroup;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Zko.ZkGroup;
        public static toObject(message: Zko.ZkGroup, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IZkColor {
        r: number;
        g: number;
        b: number;
        a: number;
    }

    class ZkColor implements IZkColor {
        constructor(properties?: Zko.IZkColor);
        public r: number;
        public g: number;
        public b: number;
        public a: number;
        public static create(properties?: Zko.IZkColor): Zko.ZkColor;
        public static encode(message: Zko.IZkColor, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Zko.IZkColor, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Zko.ZkColor;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Zko.ZkColor;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Zko.ZkColor;
        public static toObject(message: Zko.ZkColor, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IZkScene {
        id: string;
        name: string;
        transform: Zko.IZkTransform;
        clearColor: Zko.IZkColor;
    }

    class ZkScene implements IZkScene {
        constructor(properties?: Zko.IZkScene);
        public id: string;
        public name: string;
        public transform: Zko.IZkTransform;
        public clearColor: Zko.IZkColor;
        public static create(properties?: Zko.IZkScene): Zko.ZkScene;
        public static encode(message: Zko.IZkScene, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Zko.IZkScene, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Zko.ZkScene;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Zko.ZkScene;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Zko.ZkScene;
        public static toObject(message: Zko.ZkScene, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IZkTransform {
        location: Zko.IZkVector3;
        rotation: Zko.IZkQuaternion;
        scale: Zko.IZkVector3;
    }

    class ZkTransform implements IZkTransform {
        constructor(properties?: Zko.IZkTransform);
        public location: Zko.IZkVector3;
        public rotation: Zko.IZkQuaternion;
        public scale: Zko.IZkVector3;
        public static create(properties?: Zko.IZkTransform): Zko.ZkTransform;
        public static encode(message: Zko.IZkTransform, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Zko.IZkTransform, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Zko.ZkTransform;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Zko.ZkTransform;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Zko.ZkTransform;
        public static toObject(message: Zko.ZkTransform, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IZkVector3 {
        x: number;
        y: number;
        z: number;
    }

    class ZkVector3 implements IZkVector3 {
        constructor(properties?: Zko.IZkVector3);
        public x: number;
        public y: number;
        public z: number;
        public static create(properties?: Zko.IZkVector3): Zko.ZkVector3;
        public static encode(message: Zko.IZkVector3, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Zko.IZkVector3, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Zko.ZkVector3;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Zko.ZkVector3;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Zko.ZkVector3;
        public static toObject(message: Zko.ZkVector3, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IZkVector4 {
        x: number;
        y: number;
        z: number;
        w: number;
    }

    class ZkVector4 implements IZkVector4 {
        constructor(properties?: Zko.IZkVector4);
        public x: number;
        public y: number;
        public z: number;
        public w: number;
        public static create(properties?: Zko.IZkVector4): Zko.ZkVector4;
        public static encode(message: Zko.IZkVector4, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Zko.IZkVector4, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Zko.ZkVector4;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Zko.ZkVector4;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Zko.ZkVector4;
        public static toObject(message: Zko.ZkVector4, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IZkQuaternion {
        w: number;
        x: number;
        y: number;
        z: number;
    }

    class ZkQuaternion implements IZkQuaternion {
        constructor(properties?: Zko.IZkQuaternion);
        public w: number;
        public x: number;
        public y: number;
        public z: number;
        public static create(properties?: Zko.IZkQuaternion): Zko.ZkQuaternion;
        public static encode(message: Zko.IZkQuaternion, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Zko.IZkQuaternion, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Zko.ZkQuaternion;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Zko.ZkQuaternion;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Zko.ZkQuaternion;
        public static toObject(message: Zko.ZkQuaternion, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IZkModel {
        id: string;
        name: string;
        transform: Zko.IZkTransform;
        shaderProgram: Zko.IZkShaderProgram;
        mesh: Zko.IZkMesh;
    }

    class ZkModel implements IZkModel {
        constructor(properties?: Zko.IZkModel);
        public id: string;
        public name: string;
        public transform: Zko.IZkTransform;
        public shaderProgram: Zko.IZkShaderProgram;
        public mesh: Zko.IZkMesh;
        public static create(properties?: Zko.IZkModel): Zko.ZkModel;
        public static encode(message: Zko.IZkModel, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Zko.IZkModel, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Zko.ZkModel;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Zko.ZkModel;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Zko.ZkModel;
        public static toObject(message: Zko.ZkModel, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IZkMesh {
        attributeKeys?: ({ [k: string]: Zko.IZkAttributeKey }|null);
        indices: Zko.IZkIndexBuffer;
        vertices?: ({ [k: string]: Zko.IZkVertexBuffer }|null);
    }

    class ZkMesh implements IZkMesh {
        constructor(properties?: Zko.IZkMesh);
        public attributeKeys: { [k: string]: Zko.IZkAttributeKey };
        public indices: Zko.IZkIndexBuffer;
        public vertices: { [k: string]: Zko.IZkVertexBuffer };
        public static create(properties?: Zko.IZkMesh): Zko.ZkMesh;
        public static encode(message: Zko.IZkMesh, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Zko.IZkMesh, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Zko.ZkMesh;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Zko.ZkMesh;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Zko.ZkMesh;
        public static toObject(message: Zko.ZkMesh, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IZkAttributeKey {
        index: number;
        size: number;
        count: number;
        normalized: boolean;
        offset: number;
        stride: number;
    }

    class ZkAttributeKey implements IZkAttributeKey {
        constructor(properties?: Zko.IZkAttributeKey);
        public index: number;
        public size: number;
        public count: number;
        public normalized: boolean;
        public offset: number;
        public stride: number;
        public static create(properties?: Zko.IZkAttributeKey): Zko.ZkAttributeKey;
        public static encode(message: Zko.IZkAttributeKey, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Zko.IZkAttributeKey, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Zko.ZkAttributeKey;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Zko.ZkAttributeKey;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Zko.ZkAttributeKey;
        public static toObject(message: Zko.ZkAttributeKey, options?: $protobuf.IConversionOptions): { [k: string]: any };
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

    interface IZkIndexBuffer {
        targetBuffer: Zko.BufferTargetType;
        usage: Zko.BufferUsageType;
        itemSize: number;
        count: number;
        dataArray: Uint8Array;
    }

    class ZkIndexBuffer implements IZkIndexBuffer {
        constructor(properties?: Zko.IZkIndexBuffer);
        public targetBuffer: Zko.BufferTargetType;
        public usage: Zko.BufferUsageType;
        public itemSize: number;
        public count: number;
        public dataArray: Uint8Array;
        public static create(properties?: Zko.IZkIndexBuffer): Zko.ZkIndexBuffer;
        public static encode(message: Zko.IZkIndexBuffer, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Zko.IZkIndexBuffer, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Zko.ZkIndexBuffer;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Zko.ZkIndexBuffer;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Zko.ZkIndexBuffer;
        public static toObject(message: Zko.ZkIndexBuffer, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IZkVertexBuffer {
        targetBuffer: Zko.BufferTargetType;
        usage: Zko.BufferUsageType;
        itemSize: number;
        count: number;
        dataArray: Uint8Array;
    }

    class ZkVertexBuffer implements IZkVertexBuffer {
        constructor(properties?: Zko.IZkVertexBuffer);
        public targetBuffer: Zko.BufferTargetType;
        public usage: Zko.BufferUsageType;
        public itemSize: number;
        public count: number;
        public dataArray: Uint8Array;
        public static create(properties?: Zko.IZkVertexBuffer): Zko.ZkVertexBuffer;
        public static encode(message: Zko.IZkVertexBuffer, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Zko.IZkVertexBuffer, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Zko.ZkVertexBuffer;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Zko.ZkVertexBuffer;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Zko.ZkVertexBuffer;
        public static toObject(message: Zko.ZkVertexBuffer, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IZkShaderProgram {
        vertexShader: Zko.IZkShader;
        fragmentShader: Zko.IZkShader;
        attributes?: ({ [k: string]: Zko.IZkShaderAttribute }|null);
        uniforms?: ({ [k: string]: Zko.IZkShaderUniform }|null);
    }

    class ZkShaderProgram implements IZkShaderProgram {
        constructor(properties?: Zko.IZkShaderProgram);
        public vertexShader: Zko.IZkShader;
        public fragmentShader: Zko.IZkShader;
        public attributes: { [k: string]: Zko.IZkShaderAttribute };
        public uniforms: { [k: string]: Zko.IZkShaderUniform };
        public static create(properties?: Zko.IZkShaderProgram): Zko.ZkShaderProgram;
        public static encode(message: Zko.IZkShaderProgram, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Zko.IZkShaderProgram, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Zko.ZkShaderProgram;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Zko.ZkShaderProgram;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Zko.ZkShaderProgram;
        public static toObject(message: Zko.ZkShaderProgram, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IZkShader {
        type: string;
        source: string;
    }

    class ZkShader implements IZkShader {
        constructor(properties?: Zko.IZkShader);
        public type: string;
        public source: string;
        public static create(properties?: Zko.IZkShader): Zko.ZkShader;
        public static encode(message: Zko.IZkShader, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Zko.IZkShader, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Zko.ZkShader;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Zko.ZkShader;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Zko.ZkShader;
        public static toObject(message: Zko.ZkShader, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IZkShaderAttribute {
        index: number;
        attributeName: string;
    }

    class ZkShaderAttribute implements IZkShaderAttribute {
        constructor(properties?: Zko.IZkShaderAttribute);
        public index: number;
        public attributeName: string;
        public static create(properties?: Zko.IZkShaderAttribute): Zko.ZkShaderAttribute;
        public static encode(message: Zko.IZkShaderAttribute, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Zko.IZkShaderAttribute, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Zko.ZkShaderAttribute;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Zko.ZkShaderAttribute;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Zko.ZkShaderAttribute;
        public static toObject(message: Zko.ZkShaderAttribute, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    interface IZkShaderUniform {
        uniformName: string;
        count: number;
        type: Zko.ZkUniformType;
    }

    class ZkShaderUniform implements IZkShaderUniform {
        constructor(properties?: Zko.IZkShaderUniform);
        public uniformName: string;
        public count: number;
        public type: Zko.ZkUniformType;
        public static create(properties?: Zko.IZkShaderUniform): Zko.ZkShaderUniform;
        public static encode(message: Zko.IZkShaderUniform, writer?: $protobuf.Writer): $protobuf.Writer;
        public static encodeDelimited(message: Zko.IZkShaderUniform, writer?: $protobuf.Writer): $protobuf.Writer;
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Zko.ZkShaderUniform;
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Zko.ZkShaderUniform;
        public static verify(message: { [k: string]: any }): (string|null);
        public static fromObject(object: { [k: string]: any }): Zko.ZkShaderUniform;
        public static toObject(message: Zko.ZkShaderUniform, options?: $protobuf.IConversionOptions): { [k: string]: any };
        public toJSON(): { [k: string]: any };
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    enum ZkUniformType {
        SCALAR = 0,
        VEC2 = 1,
        VEC3 = 2,
        VEC4 = 3,
        MAT2 = 4,
        MAT3 = 5,
        MAT4 = 6
    }
}
