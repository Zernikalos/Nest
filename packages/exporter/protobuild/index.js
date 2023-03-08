/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const Mrr = $root.Mrr = (() => {

    /**
     * Namespace Mrr.
     * @exports Mrr
     * @namespace
     */
    const Mrr = {};

    Mrr.ProtoMrObject = (function() {

        /**
         * Properties of a ProtoMrObject.
         * @memberof Mrr
         * @interface IProtoMrObject
         * @property {string} type ProtoMrObject type
         * @property {Mrr.IMrGroup|null} [group] ProtoMrObject group
         * @property {Mrr.IMrModel|null} [model] ProtoMrObject model
         * @property {Mrr.IMrScene|null} [scene] ProtoMrObject scene
         * @property {Array.<Mrr.IProtoMrObject>|null} [children] ProtoMrObject children
         */

        /**
         * Constructs a new ProtoMrObject.
         * @memberof Mrr
         * @classdesc Represents a ProtoMrObject.
         * @implements IProtoMrObject
         * @constructor
         * @param {Mrr.IProtoMrObject=} [properties] Properties to set
         */
        function ProtoMrObject(properties) {
            this.children = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProtoMrObject type.
         * @member {string} type
         * @memberof Mrr.ProtoMrObject
         * @instance
         */
        ProtoMrObject.prototype.type = "";

        /**
         * ProtoMrObject group.
         * @member {Mrr.IMrGroup|null|undefined} group
         * @memberof Mrr.ProtoMrObject
         * @instance
         */
        ProtoMrObject.prototype.group = null;

        /**
         * ProtoMrObject model.
         * @member {Mrr.IMrModel|null|undefined} model
         * @memberof Mrr.ProtoMrObject
         * @instance
         */
        ProtoMrObject.prototype.model = null;

        /**
         * ProtoMrObject scene.
         * @member {Mrr.IMrScene|null|undefined} scene
         * @memberof Mrr.ProtoMrObject
         * @instance
         */
        ProtoMrObject.prototype.scene = null;

        /**
         * ProtoMrObject children.
         * @member {Array.<Mrr.IProtoMrObject>} children
         * @memberof Mrr.ProtoMrObject
         * @instance
         */
        ProtoMrObject.prototype.children = $util.emptyArray;

        /**
         * Creates a new ProtoMrObject instance using the specified properties.
         * @function create
         * @memberof Mrr.ProtoMrObject
         * @static
         * @param {Mrr.IProtoMrObject=} [properties] Properties to set
         * @returns {Mrr.ProtoMrObject} ProtoMrObject instance
         */
        ProtoMrObject.create = function create(properties) {
            return new ProtoMrObject(properties);
        };

        /**
         * Encodes the specified ProtoMrObject message. Does not implicitly {@link Mrr.ProtoMrObject.verify|verify} messages.
         * @function encode
         * @memberof Mrr.ProtoMrObject
         * @static
         * @param {Mrr.IProtoMrObject} message ProtoMrObject message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProtoMrObject.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.type);
            if (message.group != null && Object.hasOwnProperty.call(message, "group"))
                $root.Mrr.MrGroup.encode(message.group, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.model != null && Object.hasOwnProperty.call(message, "model"))
                $root.Mrr.MrModel.encode(message.model, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.scene != null && Object.hasOwnProperty.call(message, "scene"))
                $root.Mrr.MrScene.encode(message.scene, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.children != null && message.children.length)
                for (let i = 0; i < message.children.length; ++i)
                    $root.Mrr.ProtoMrObject.encode(message.children[i], writer.uint32(/* id 100, wireType 2 =*/802).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ProtoMrObject message, length delimited. Does not implicitly {@link Mrr.ProtoMrObject.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Mrr.ProtoMrObject
         * @static
         * @param {Mrr.IProtoMrObject} message ProtoMrObject message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProtoMrObject.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ProtoMrObject message from the specified reader or buffer.
         * @function decode
         * @memberof Mrr.ProtoMrObject
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Mrr.ProtoMrObject} ProtoMrObject
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProtoMrObject.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Mrr.ProtoMrObject();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.type = reader.string();
                        break;
                    }
                case 2: {
                        message.group = $root.Mrr.MrGroup.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.model = $root.Mrr.MrModel.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.scene = $root.Mrr.MrScene.decode(reader, reader.uint32());
                        break;
                    }
                case 100: {
                        if (!(message.children && message.children.length))
                            message.children = [];
                        message.children.push($root.Mrr.ProtoMrObject.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("type"))
                throw $util.ProtocolError("missing required 'type'", { instance: message });
            return message;
        };

        /**
         * Decodes a ProtoMrObject message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Mrr.ProtoMrObject
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Mrr.ProtoMrObject} ProtoMrObject
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProtoMrObject.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProtoMrObject message.
         * @function verify
         * @memberof Mrr.ProtoMrObject
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProtoMrObject.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.type))
                return "type: string expected";
            if (message.group != null && message.hasOwnProperty("group")) {
                let error = $root.Mrr.MrGroup.verify(message.group);
                if (error)
                    return "group." + error;
            }
            if (message.model != null && message.hasOwnProperty("model")) {
                let error = $root.Mrr.MrModel.verify(message.model);
                if (error)
                    return "model." + error;
            }
            if (message.scene != null && message.hasOwnProperty("scene")) {
                let error = $root.Mrr.MrScene.verify(message.scene);
                if (error)
                    return "scene." + error;
            }
            if (message.children != null && message.hasOwnProperty("children")) {
                if (!Array.isArray(message.children))
                    return "children: array expected";
                for (let i = 0; i < message.children.length; ++i) {
                    let error = $root.Mrr.ProtoMrObject.verify(message.children[i]);
                    if (error)
                        return "children." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ProtoMrObject message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Mrr.ProtoMrObject
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Mrr.ProtoMrObject} ProtoMrObject
         */
        ProtoMrObject.fromObject = function fromObject(object) {
            if (object instanceof $root.Mrr.ProtoMrObject)
                return object;
            let message = new $root.Mrr.ProtoMrObject();
            if (object.type != null)
                message.type = String(object.type);
            if (object.group != null) {
                if (typeof object.group !== "object")
                    throw TypeError(".Mrr.ProtoMrObject.group: object expected");
                message.group = $root.Mrr.MrGroup.fromObject(object.group);
            }
            if (object.model != null) {
                if (typeof object.model !== "object")
                    throw TypeError(".Mrr.ProtoMrObject.model: object expected");
                message.model = $root.Mrr.MrModel.fromObject(object.model);
            }
            if (object.scene != null) {
                if (typeof object.scene !== "object")
                    throw TypeError(".Mrr.ProtoMrObject.scene: object expected");
                message.scene = $root.Mrr.MrScene.fromObject(object.scene);
            }
            if (object.children) {
                if (!Array.isArray(object.children))
                    throw TypeError(".Mrr.ProtoMrObject.children: array expected");
                message.children = [];
                for (let i = 0; i < object.children.length; ++i) {
                    if (typeof object.children[i] !== "object")
                        throw TypeError(".Mrr.ProtoMrObject.children: object expected");
                    message.children[i] = $root.Mrr.ProtoMrObject.fromObject(object.children[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a ProtoMrObject message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Mrr.ProtoMrObject
         * @static
         * @param {Mrr.ProtoMrObject} message ProtoMrObject
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProtoMrObject.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.children = [];
            if (options.defaults) {
                object.type = "";
                object.group = null;
                object.model = null;
                object.scene = null;
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.group != null && message.hasOwnProperty("group"))
                object.group = $root.Mrr.MrGroup.toObject(message.group, options);
            if (message.model != null && message.hasOwnProperty("model"))
                object.model = $root.Mrr.MrModel.toObject(message.model, options);
            if (message.scene != null && message.hasOwnProperty("scene"))
                object.scene = $root.Mrr.MrScene.toObject(message.scene, options);
            if (message.children && message.children.length) {
                object.children = [];
                for (let j = 0; j < message.children.length; ++j)
                    object.children[j] = $root.Mrr.ProtoMrObject.toObject(message.children[j], options);
            }
            return object;
        };

        /**
         * Converts this ProtoMrObject to JSON.
         * @function toJSON
         * @memberof Mrr.ProtoMrObject
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProtoMrObject.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ProtoMrObject
         * @function getTypeUrl
         * @memberof Mrr.ProtoMrObject
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ProtoMrObject.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Mrr.ProtoMrObject";
        };

        return ProtoMrObject;
    })();

    Mrr.MrGroup = (function() {

        /**
         * Properties of a MrGroup.
         * @memberof Mrr
         * @interface IMrGroup
         * @property {string} id MrGroup id
         * @property {string} name MrGroup name
         * @property {Mrr.IMrTransform} transform MrGroup transform
         */

        /**
         * Constructs a new MrGroup.
         * @memberof Mrr
         * @classdesc Represents a MrGroup.
         * @implements IMrGroup
         * @constructor
         * @param {Mrr.IMrGroup=} [properties] Properties to set
         */
        function MrGroup(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MrGroup id.
         * @member {string} id
         * @memberof Mrr.MrGroup
         * @instance
         */
        MrGroup.prototype.id = "";

        /**
         * MrGroup name.
         * @member {string} name
         * @memberof Mrr.MrGroup
         * @instance
         */
        MrGroup.prototype.name = "";

        /**
         * MrGroup transform.
         * @member {Mrr.IMrTransform} transform
         * @memberof Mrr.MrGroup
         * @instance
         */
        MrGroup.prototype.transform = null;

        /**
         * Creates a new MrGroup instance using the specified properties.
         * @function create
         * @memberof Mrr.MrGroup
         * @static
         * @param {Mrr.IMrGroup=} [properties] Properties to set
         * @returns {Mrr.MrGroup} MrGroup instance
         */
        MrGroup.create = function create(properties) {
            return new MrGroup(properties);
        };

        /**
         * Encodes the specified MrGroup message. Does not implicitly {@link Mrr.MrGroup.verify|verify} messages.
         * @function encode
         * @memberof Mrr.MrGroup
         * @static
         * @param {Mrr.IMrGroup} message MrGroup message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrGroup.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            $root.Mrr.MrTransform.encode(message.transform, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified MrGroup message, length delimited. Does not implicitly {@link Mrr.MrGroup.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Mrr.MrGroup
         * @static
         * @param {Mrr.IMrGroup} message MrGroup message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrGroup.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MrGroup message from the specified reader or buffer.
         * @function decode
         * @memberof Mrr.MrGroup
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Mrr.MrGroup} MrGroup
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrGroup.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Mrr.MrGroup();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.transform = $root.Mrr.MrTransform.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("id"))
                throw $util.ProtocolError("missing required 'id'", { instance: message });
            if (!message.hasOwnProperty("name"))
                throw $util.ProtocolError("missing required 'name'", { instance: message });
            if (!message.hasOwnProperty("transform"))
                throw $util.ProtocolError("missing required 'transform'", { instance: message });
            return message;
        };

        /**
         * Decodes a MrGroup message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Mrr.MrGroup
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Mrr.MrGroup} MrGroup
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrGroup.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MrGroup message.
         * @function verify
         * @memberof Mrr.MrGroup
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MrGroup.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.id))
                return "id: string expected";
            if (!$util.isString(message.name))
                return "name: string expected";
            {
                let error = $root.Mrr.MrTransform.verify(message.transform);
                if (error)
                    return "transform." + error;
            }
            return null;
        };

        /**
         * Creates a MrGroup message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Mrr.MrGroup
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Mrr.MrGroup} MrGroup
         */
        MrGroup.fromObject = function fromObject(object) {
            if (object instanceof $root.Mrr.MrGroup)
                return object;
            let message = new $root.Mrr.MrGroup();
            if (object.id != null)
                message.id = String(object.id);
            if (object.name != null)
                message.name = String(object.name);
            if (object.transform != null) {
                if (typeof object.transform !== "object")
                    throw TypeError(".Mrr.MrGroup.transform: object expected");
                message.transform = $root.Mrr.MrTransform.fromObject(object.transform);
            }
            return message;
        };

        /**
         * Creates a plain object from a MrGroup message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Mrr.MrGroup
         * @static
         * @param {Mrr.MrGroup} message MrGroup
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MrGroup.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = "";
                object.name = "";
                object.transform = null;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.transform != null && message.hasOwnProperty("transform"))
                object.transform = $root.Mrr.MrTransform.toObject(message.transform, options);
            return object;
        };

        /**
         * Converts this MrGroup to JSON.
         * @function toJSON
         * @memberof Mrr.MrGroup
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MrGroup.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MrGroup
         * @function getTypeUrl
         * @memberof Mrr.MrGroup
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MrGroup.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Mrr.MrGroup";
        };

        return MrGroup;
    })();

    Mrr.MrColor = (function() {

        /**
         * Properties of a MrColor.
         * @memberof Mrr
         * @interface IMrColor
         * @property {number} r MrColor r
         * @property {number} g MrColor g
         * @property {number} b MrColor b
         * @property {number} a MrColor a
         */

        /**
         * Constructs a new MrColor.
         * @memberof Mrr
         * @classdesc Represents a MrColor.
         * @implements IMrColor
         * @constructor
         * @param {Mrr.IMrColor=} [properties] Properties to set
         */
        function MrColor(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MrColor r.
         * @member {number} r
         * @memberof Mrr.MrColor
         * @instance
         */
        MrColor.prototype.r = 0;

        /**
         * MrColor g.
         * @member {number} g
         * @memberof Mrr.MrColor
         * @instance
         */
        MrColor.prototype.g = 0;

        /**
         * MrColor b.
         * @member {number} b
         * @memberof Mrr.MrColor
         * @instance
         */
        MrColor.prototype.b = 0;

        /**
         * MrColor a.
         * @member {number} a
         * @memberof Mrr.MrColor
         * @instance
         */
        MrColor.prototype.a = 0;

        /**
         * Creates a new MrColor instance using the specified properties.
         * @function create
         * @memberof Mrr.MrColor
         * @static
         * @param {Mrr.IMrColor=} [properties] Properties to set
         * @returns {Mrr.MrColor} MrColor instance
         */
        MrColor.create = function create(properties) {
            return new MrColor(properties);
        };

        /**
         * Encodes the specified MrColor message. Does not implicitly {@link Mrr.MrColor.verify|verify} messages.
         * @function encode
         * @memberof Mrr.MrColor
         * @static
         * @param {Mrr.IMrColor} message MrColor message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrColor.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 5 =*/13).float(message.r);
            writer.uint32(/* id 2, wireType 5 =*/21).float(message.g);
            writer.uint32(/* id 3, wireType 5 =*/29).float(message.b);
            writer.uint32(/* id 4, wireType 5 =*/37).float(message.a);
            return writer;
        };

        /**
         * Encodes the specified MrColor message, length delimited. Does not implicitly {@link Mrr.MrColor.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Mrr.MrColor
         * @static
         * @param {Mrr.IMrColor} message MrColor message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrColor.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MrColor message from the specified reader or buffer.
         * @function decode
         * @memberof Mrr.MrColor
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Mrr.MrColor} MrColor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrColor.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Mrr.MrColor();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.r = reader.float();
                        break;
                    }
                case 2: {
                        message.g = reader.float();
                        break;
                    }
                case 3: {
                        message.b = reader.float();
                        break;
                    }
                case 4: {
                        message.a = reader.float();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("r"))
                throw $util.ProtocolError("missing required 'r'", { instance: message });
            if (!message.hasOwnProperty("g"))
                throw $util.ProtocolError("missing required 'g'", { instance: message });
            if (!message.hasOwnProperty("b"))
                throw $util.ProtocolError("missing required 'b'", { instance: message });
            if (!message.hasOwnProperty("a"))
                throw $util.ProtocolError("missing required 'a'", { instance: message });
            return message;
        };

        /**
         * Decodes a MrColor message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Mrr.MrColor
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Mrr.MrColor} MrColor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrColor.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MrColor message.
         * @function verify
         * @memberof Mrr.MrColor
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MrColor.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (typeof message.r !== "number")
                return "r: number expected";
            if (typeof message.g !== "number")
                return "g: number expected";
            if (typeof message.b !== "number")
                return "b: number expected";
            if (typeof message.a !== "number")
                return "a: number expected";
            return null;
        };

        /**
         * Creates a MrColor message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Mrr.MrColor
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Mrr.MrColor} MrColor
         */
        MrColor.fromObject = function fromObject(object) {
            if (object instanceof $root.Mrr.MrColor)
                return object;
            let message = new $root.Mrr.MrColor();
            if (object.r != null)
                message.r = Number(object.r);
            if (object.g != null)
                message.g = Number(object.g);
            if (object.b != null)
                message.b = Number(object.b);
            if (object.a != null)
                message.a = Number(object.a);
            return message;
        };

        /**
         * Creates a plain object from a MrColor message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Mrr.MrColor
         * @static
         * @param {Mrr.MrColor} message MrColor
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MrColor.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.r = 0;
                object.g = 0;
                object.b = 0;
                object.a = 0;
            }
            if (message.r != null && message.hasOwnProperty("r"))
                object.r = options.json && !isFinite(message.r) ? String(message.r) : message.r;
            if (message.g != null && message.hasOwnProperty("g"))
                object.g = options.json && !isFinite(message.g) ? String(message.g) : message.g;
            if (message.b != null && message.hasOwnProperty("b"))
                object.b = options.json && !isFinite(message.b) ? String(message.b) : message.b;
            if (message.a != null && message.hasOwnProperty("a"))
                object.a = options.json && !isFinite(message.a) ? String(message.a) : message.a;
            return object;
        };

        /**
         * Converts this MrColor to JSON.
         * @function toJSON
         * @memberof Mrr.MrColor
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MrColor.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MrColor
         * @function getTypeUrl
         * @memberof Mrr.MrColor
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MrColor.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Mrr.MrColor";
        };

        return MrColor;
    })();

    Mrr.MrScene = (function() {

        /**
         * Properties of a MrScene.
         * @memberof Mrr
         * @interface IMrScene
         * @property {string} id MrScene id
         * @property {string} name MrScene name
         * @property {Mrr.IMrTransform} transform MrScene transform
         * @property {Mrr.IMrColor} clearColor MrScene clearColor
         */

        /**
         * Constructs a new MrScene.
         * @memberof Mrr
         * @classdesc Represents a MrScene.
         * @implements IMrScene
         * @constructor
         * @param {Mrr.IMrScene=} [properties] Properties to set
         */
        function MrScene(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MrScene id.
         * @member {string} id
         * @memberof Mrr.MrScene
         * @instance
         */
        MrScene.prototype.id = "";

        /**
         * MrScene name.
         * @member {string} name
         * @memberof Mrr.MrScene
         * @instance
         */
        MrScene.prototype.name = "";

        /**
         * MrScene transform.
         * @member {Mrr.IMrTransform} transform
         * @memberof Mrr.MrScene
         * @instance
         */
        MrScene.prototype.transform = null;

        /**
         * MrScene clearColor.
         * @member {Mrr.IMrColor} clearColor
         * @memberof Mrr.MrScene
         * @instance
         */
        MrScene.prototype.clearColor = null;

        /**
         * Creates a new MrScene instance using the specified properties.
         * @function create
         * @memberof Mrr.MrScene
         * @static
         * @param {Mrr.IMrScene=} [properties] Properties to set
         * @returns {Mrr.MrScene} MrScene instance
         */
        MrScene.create = function create(properties) {
            return new MrScene(properties);
        };

        /**
         * Encodes the specified MrScene message. Does not implicitly {@link Mrr.MrScene.verify|verify} messages.
         * @function encode
         * @memberof Mrr.MrScene
         * @static
         * @param {Mrr.IMrScene} message MrScene message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrScene.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            $root.Mrr.MrTransform.encode(message.transform, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            $root.Mrr.MrColor.encode(message.clearColor, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified MrScene message, length delimited. Does not implicitly {@link Mrr.MrScene.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Mrr.MrScene
         * @static
         * @param {Mrr.IMrScene} message MrScene message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrScene.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MrScene message from the specified reader or buffer.
         * @function decode
         * @memberof Mrr.MrScene
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Mrr.MrScene} MrScene
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrScene.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Mrr.MrScene();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.transform = $root.Mrr.MrTransform.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.clearColor = $root.Mrr.MrColor.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("id"))
                throw $util.ProtocolError("missing required 'id'", { instance: message });
            if (!message.hasOwnProperty("name"))
                throw $util.ProtocolError("missing required 'name'", { instance: message });
            if (!message.hasOwnProperty("transform"))
                throw $util.ProtocolError("missing required 'transform'", { instance: message });
            if (!message.hasOwnProperty("clearColor"))
                throw $util.ProtocolError("missing required 'clearColor'", { instance: message });
            return message;
        };

        /**
         * Decodes a MrScene message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Mrr.MrScene
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Mrr.MrScene} MrScene
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrScene.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MrScene message.
         * @function verify
         * @memberof Mrr.MrScene
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MrScene.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.id))
                return "id: string expected";
            if (!$util.isString(message.name))
                return "name: string expected";
            {
                let error = $root.Mrr.MrTransform.verify(message.transform);
                if (error)
                    return "transform." + error;
            }
            {
                let error = $root.Mrr.MrColor.verify(message.clearColor);
                if (error)
                    return "clearColor." + error;
            }
            return null;
        };

        /**
         * Creates a MrScene message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Mrr.MrScene
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Mrr.MrScene} MrScene
         */
        MrScene.fromObject = function fromObject(object) {
            if (object instanceof $root.Mrr.MrScene)
                return object;
            let message = new $root.Mrr.MrScene();
            if (object.id != null)
                message.id = String(object.id);
            if (object.name != null)
                message.name = String(object.name);
            if (object.transform != null) {
                if (typeof object.transform !== "object")
                    throw TypeError(".Mrr.MrScene.transform: object expected");
                message.transform = $root.Mrr.MrTransform.fromObject(object.transform);
            }
            if (object.clearColor != null) {
                if (typeof object.clearColor !== "object")
                    throw TypeError(".Mrr.MrScene.clearColor: object expected");
                message.clearColor = $root.Mrr.MrColor.fromObject(object.clearColor);
            }
            return message;
        };

        /**
         * Creates a plain object from a MrScene message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Mrr.MrScene
         * @static
         * @param {Mrr.MrScene} message MrScene
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MrScene.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = "";
                object.name = "";
                object.transform = null;
                object.clearColor = null;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.transform != null && message.hasOwnProperty("transform"))
                object.transform = $root.Mrr.MrTransform.toObject(message.transform, options);
            if (message.clearColor != null && message.hasOwnProperty("clearColor"))
                object.clearColor = $root.Mrr.MrColor.toObject(message.clearColor, options);
            return object;
        };

        /**
         * Converts this MrScene to JSON.
         * @function toJSON
         * @memberof Mrr.MrScene
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MrScene.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MrScene
         * @function getTypeUrl
         * @memberof Mrr.MrScene
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MrScene.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Mrr.MrScene";
        };

        return MrScene;
    })();

    Mrr.MrTransform = (function() {

        /**
         * Properties of a MrTransform.
         * @memberof Mrr
         * @interface IMrTransform
         * @property {Mrr.IMrVector3} location MrTransform location
         * @property {Mrr.IMrQuaternion} rotation MrTransform rotation
         * @property {Mrr.IMrVector3} scale MrTransform scale
         */

        /**
         * Constructs a new MrTransform.
         * @memberof Mrr
         * @classdesc Represents a MrTransform.
         * @implements IMrTransform
         * @constructor
         * @param {Mrr.IMrTransform=} [properties] Properties to set
         */
        function MrTransform(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MrTransform location.
         * @member {Mrr.IMrVector3} location
         * @memberof Mrr.MrTransform
         * @instance
         */
        MrTransform.prototype.location = null;

        /**
         * MrTransform rotation.
         * @member {Mrr.IMrQuaternion} rotation
         * @memberof Mrr.MrTransform
         * @instance
         */
        MrTransform.prototype.rotation = null;

        /**
         * MrTransform scale.
         * @member {Mrr.IMrVector3} scale
         * @memberof Mrr.MrTransform
         * @instance
         */
        MrTransform.prototype.scale = null;

        /**
         * Creates a new MrTransform instance using the specified properties.
         * @function create
         * @memberof Mrr.MrTransform
         * @static
         * @param {Mrr.IMrTransform=} [properties] Properties to set
         * @returns {Mrr.MrTransform} MrTransform instance
         */
        MrTransform.create = function create(properties) {
            return new MrTransform(properties);
        };

        /**
         * Encodes the specified MrTransform message. Does not implicitly {@link Mrr.MrTransform.verify|verify} messages.
         * @function encode
         * @memberof Mrr.MrTransform
         * @static
         * @param {Mrr.IMrTransform} message MrTransform message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrTransform.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            $root.Mrr.MrVector3.encode(message.location, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            $root.Mrr.MrQuaternion.encode(message.rotation, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            $root.Mrr.MrVector3.encode(message.scale, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified MrTransform message, length delimited. Does not implicitly {@link Mrr.MrTransform.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Mrr.MrTransform
         * @static
         * @param {Mrr.IMrTransform} message MrTransform message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrTransform.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MrTransform message from the specified reader or buffer.
         * @function decode
         * @memberof Mrr.MrTransform
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Mrr.MrTransform} MrTransform
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrTransform.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Mrr.MrTransform();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.location = $root.Mrr.MrVector3.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.rotation = $root.Mrr.MrQuaternion.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.scale = $root.Mrr.MrVector3.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("location"))
                throw $util.ProtocolError("missing required 'location'", { instance: message });
            if (!message.hasOwnProperty("rotation"))
                throw $util.ProtocolError("missing required 'rotation'", { instance: message });
            if (!message.hasOwnProperty("scale"))
                throw $util.ProtocolError("missing required 'scale'", { instance: message });
            return message;
        };

        /**
         * Decodes a MrTransform message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Mrr.MrTransform
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Mrr.MrTransform} MrTransform
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrTransform.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MrTransform message.
         * @function verify
         * @memberof Mrr.MrTransform
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MrTransform.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            {
                let error = $root.Mrr.MrVector3.verify(message.location);
                if (error)
                    return "location." + error;
            }
            {
                let error = $root.Mrr.MrQuaternion.verify(message.rotation);
                if (error)
                    return "rotation." + error;
            }
            {
                let error = $root.Mrr.MrVector3.verify(message.scale);
                if (error)
                    return "scale." + error;
            }
            return null;
        };

        /**
         * Creates a MrTransform message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Mrr.MrTransform
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Mrr.MrTransform} MrTransform
         */
        MrTransform.fromObject = function fromObject(object) {
            if (object instanceof $root.Mrr.MrTransform)
                return object;
            let message = new $root.Mrr.MrTransform();
            if (object.location != null) {
                if (typeof object.location !== "object")
                    throw TypeError(".Mrr.MrTransform.location: object expected");
                message.location = $root.Mrr.MrVector3.fromObject(object.location);
            }
            if (object.rotation != null) {
                if (typeof object.rotation !== "object")
                    throw TypeError(".Mrr.MrTransform.rotation: object expected");
                message.rotation = $root.Mrr.MrQuaternion.fromObject(object.rotation);
            }
            if (object.scale != null) {
                if (typeof object.scale !== "object")
                    throw TypeError(".Mrr.MrTransform.scale: object expected");
                message.scale = $root.Mrr.MrVector3.fromObject(object.scale);
            }
            return message;
        };

        /**
         * Creates a plain object from a MrTransform message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Mrr.MrTransform
         * @static
         * @param {Mrr.MrTransform} message MrTransform
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MrTransform.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.location = null;
                object.rotation = null;
                object.scale = null;
            }
            if (message.location != null && message.hasOwnProperty("location"))
                object.location = $root.Mrr.MrVector3.toObject(message.location, options);
            if (message.rotation != null && message.hasOwnProperty("rotation"))
                object.rotation = $root.Mrr.MrQuaternion.toObject(message.rotation, options);
            if (message.scale != null && message.hasOwnProperty("scale"))
                object.scale = $root.Mrr.MrVector3.toObject(message.scale, options);
            return object;
        };

        /**
         * Converts this MrTransform to JSON.
         * @function toJSON
         * @memberof Mrr.MrTransform
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MrTransform.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MrTransform
         * @function getTypeUrl
         * @memberof Mrr.MrTransform
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MrTransform.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Mrr.MrTransform";
        };

        return MrTransform;
    })();

    Mrr.MrVector3 = (function() {

        /**
         * Properties of a MrVector3.
         * @memberof Mrr
         * @interface IMrVector3
         * @property {number} x MrVector3 x
         * @property {number} y MrVector3 y
         * @property {number} z MrVector3 z
         */

        /**
         * Constructs a new MrVector3.
         * @memberof Mrr
         * @classdesc Represents a MrVector3.
         * @implements IMrVector3
         * @constructor
         * @param {Mrr.IMrVector3=} [properties] Properties to set
         */
        function MrVector3(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MrVector3 x.
         * @member {number} x
         * @memberof Mrr.MrVector3
         * @instance
         */
        MrVector3.prototype.x = 0;

        /**
         * MrVector3 y.
         * @member {number} y
         * @memberof Mrr.MrVector3
         * @instance
         */
        MrVector3.prototype.y = 0;

        /**
         * MrVector3 z.
         * @member {number} z
         * @memberof Mrr.MrVector3
         * @instance
         */
        MrVector3.prototype.z = 0;

        /**
         * Creates a new MrVector3 instance using the specified properties.
         * @function create
         * @memberof Mrr.MrVector3
         * @static
         * @param {Mrr.IMrVector3=} [properties] Properties to set
         * @returns {Mrr.MrVector3} MrVector3 instance
         */
        MrVector3.create = function create(properties) {
            return new MrVector3(properties);
        };

        /**
         * Encodes the specified MrVector3 message. Does not implicitly {@link Mrr.MrVector3.verify|verify} messages.
         * @function encode
         * @memberof Mrr.MrVector3
         * @static
         * @param {Mrr.IMrVector3} message MrVector3 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrVector3.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 5 =*/13).float(message.x);
            writer.uint32(/* id 2, wireType 5 =*/21).float(message.y);
            writer.uint32(/* id 3, wireType 5 =*/29).float(message.z);
            return writer;
        };

        /**
         * Encodes the specified MrVector3 message, length delimited. Does not implicitly {@link Mrr.MrVector3.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Mrr.MrVector3
         * @static
         * @param {Mrr.IMrVector3} message MrVector3 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrVector3.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MrVector3 message from the specified reader or buffer.
         * @function decode
         * @memberof Mrr.MrVector3
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Mrr.MrVector3} MrVector3
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrVector3.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Mrr.MrVector3();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.x = reader.float();
                        break;
                    }
                case 2: {
                        message.y = reader.float();
                        break;
                    }
                case 3: {
                        message.z = reader.float();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("x"))
                throw $util.ProtocolError("missing required 'x'", { instance: message });
            if (!message.hasOwnProperty("y"))
                throw $util.ProtocolError("missing required 'y'", { instance: message });
            if (!message.hasOwnProperty("z"))
                throw $util.ProtocolError("missing required 'z'", { instance: message });
            return message;
        };

        /**
         * Decodes a MrVector3 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Mrr.MrVector3
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Mrr.MrVector3} MrVector3
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrVector3.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MrVector3 message.
         * @function verify
         * @memberof Mrr.MrVector3
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MrVector3.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (typeof message.x !== "number")
                return "x: number expected";
            if (typeof message.y !== "number")
                return "y: number expected";
            if (typeof message.z !== "number")
                return "z: number expected";
            return null;
        };

        /**
         * Creates a MrVector3 message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Mrr.MrVector3
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Mrr.MrVector3} MrVector3
         */
        MrVector3.fromObject = function fromObject(object) {
            if (object instanceof $root.Mrr.MrVector3)
                return object;
            let message = new $root.Mrr.MrVector3();
            if (object.x != null)
                message.x = Number(object.x);
            if (object.y != null)
                message.y = Number(object.y);
            if (object.z != null)
                message.z = Number(object.z);
            return message;
        };

        /**
         * Creates a plain object from a MrVector3 message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Mrr.MrVector3
         * @static
         * @param {Mrr.MrVector3} message MrVector3
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MrVector3.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.x = 0;
                object.y = 0;
                object.z = 0;
            }
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
            if (message.z != null && message.hasOwnProperty("z"))
                object.z = options.json && !isFinite(message.z) ? String(message.z) : message.z;
            return object;
        };

        /**
         * Converts this MrVector3 to JSON.
         * @function toJSON
         * @memberof Mrr.MrVector3
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MrVector3.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MrVector3
         * @function getTypeUrl
         * @memberof Mrr.MrVector3
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MrVector3.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Mrr.MrVector3";
        };

        return MrVector3;
    })();

    Mrr.MrVector4 = (function() {

        /**
         * Properties of a MrVector4.
         * @memberof Mrr
         * @interface IMrVector4
         * @property {number} x MrVector4 x
         * @property {number} y MrVector4 y
         * @property {number} z MrVector4 z
         * @property {number} w MrVector4 w
         */

        /**
         * Constructs a new MrVector4.
         * @memberof Mrr
         * @classdesc Represents a MrVector4.
         * @implements IMrVector4
         * @constructor
         * @param {Mrr.IMrVector4=} [properties] Properties to set
         */
        function MrVector4(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MrVector4 x.
         * @member {number} x
         * @memberof Mrr.MrVector4
         * @instance
         */
        MrVector4.prototype.x = 0;

        /**
         * MrVector4 y.
         * @member {number} y
         * @memberof Mrr.MrVector4
         * @instance
         */
        MrVector4.prototype.y = 0;

        /**
         * MrVector4 z.
         * @member {number} z
         * @memberof Mrr.MrVector4
         * @instance
         */
        MrVector4.prototype.z = 0;

        /**
         * MrVector4 w.
         * @member {number} w
         * @memberof Mrr.MrVector4
         * @instance
         */
        MrVector4.prototype.w = 0;

        /**
         * Creates a new MrVector4 instance using the specified properties.
         * @function create
         * @memberof Mrr.MrVector4
         * @static
         * @param {Mrr.IMrVector4=} [properties] Properties to set
         * @returns {Mrr.MrVector4} MrVector4 instance
         */
        MrVector4.create = function create(properties) {
            return new MrVector4(properties);
        };

        /**
         * Encodes the specified MrVector4 message. Does not implicitly {@link Mrr.MrVector4.verify|verify} messages.
         * @function encode
         * @memberof Mrr.MrVector4
         * @static
         * @param {Mrr.IMrVector4} message MrVector4 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrVector4.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 5 =*/13).float(message.x);
            writer.uint32(/* id 2, wireType 5 =*/21).float(message.y);
            writer.uint32(/* id 3, wireType 5 =*/29).float(message.z);
            writer.uint32(/* id 4, wireType 5 =*/37).float(message.w);
            return writer;
        };

        /**
         * Encodes the specified MrVector4 message, length delimited. Does not implicitly {@link Mrr.MrVector4.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Mrr.MrVector4
         * @static
         * @param {Mrr.IMrVector4} message MrVector4 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrVector4.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MrVector4 message from the specified reader or buffer.
         * @function decode
         * @memberof Mrr.MrVector4
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Mrr.MrVector4} MrVector4
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrVector4.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Mrr.MrVector4();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.x = reader.float();
                        break;
                    }
                case 2: {
                        message.y = reader.float();
                        break;
                    }
                case 3: {
                        message.z = reader.float();
                        break;
                    }
                case 4: {
                        message.w = reader.float();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("x"))
                throw $util.ProtocolError("missing required 'x'", { instance: message });
            if (!message.hasOwnProperty("y"))
                throw $util.ProtocolError("missing required 'y'", { instance: message });
            if (!message.hasOwnProperty("z"))
                throw $util.ProtocolError("missing required 'z'", { instance: message });
            if (!message.hasOwnProperty("w"))
                throw $util.ProtocolError("missing required 'w'", { instance: message });
            return message;
        };

        /**
         * Decodes a MrVector4 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Mrr.MrVector4
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Mrr.MrVector4} MrVector4
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrVector4.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MrVector4 message.
         * @function verify
         * @memberof Mrr.MrVector4
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MrVector4.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (typeof message.x !== "number")
                return "x: number expected";
            if (typeof message.y !== "number")
                return "y: number expected";
            if (typeof message.z !== "number")
                return "z: number expected";
            if (typeof message.w !== "number")
                return "w: number expected";
            return null;
        };

        /**
         * Creates a MrVector4 message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Mrr.MrVector4
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Mrr.MrVector4} MrVector4
         */
        MrVector4.fromObject = function fromObject(object) {
            if (object instanceof $root.Mrr.MrVector4)
                return object;
            let message = new $root.Mrr.MrVector4();
            if (object.x != null)
                message.x = Number(object.x);
            if (object.y != null)
                message.y = Number(object.y);
            if (object.z != null)
                message.z = Number(object.z);
            if (object.w != null)
                message.w = Number(object.w);
            return message;
        };

        /**
         * Creates a plain object from a MrVector4 message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Mrr.MrVector4
         * @static
         * @param {Mrr.MrVector4} message MrVector4
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MrVector4.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.x = 0;
                object.y = 0;
                object.z = 0;
                object.w = 0;
            }
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
            if (message.z != null && message.hasOwnProperty("z"))
                object.z = options.json && !isFinite(message.z) ? String(message.z) : message.z;
            if (message.w != null && message.hasOwnProperty("w"))
                object.w = options.json && !isFinite(message.w) ? String(message.w) : message.w;
            return object;
        };

        /**
         * Converts this MrVector4 to JSON.
         * @function toJSON
         * @memberof Mrr.MrVector4
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MrVector4.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MrVector4
         * @function getTypeUrl
         * @memberof Mrr.MrVector4
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MrVector4.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Mrr.MrVector4";
        };

        return MrVector4;
    })();

    Mrr.MrQuaternion = (function() {

        /**
         * Properties of a MrQuaternion.
         * @memberof Mrr
         * @interface IMrQuaternion
         * @property {number} w MrQuaternion w
         * @property {number} x MrQuaternion x
         * @property {number} y MrQuaternion y
         * @property {number} z MrQuaternion z
         */

        /**
         * Constructs a new MrQuaternion.
         * @memberof Mrr
         * @classdesc Represents a MrQuaternion.
         * @implements IMrQuaternion
         * @constructor
         * @param {Mrr.IMrQuaternion=} [properties] Properties to set
         */
        function MrQuaternion(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MrQuaternion w.
         * @member {number} w
         * @memberof Mrr.MrQuaternion
         * @instance
         */
        MrQuaternion.prototype.w = 0;

        /**
         * MrQuaternion x.
         * @member {number} x
         * @memberof Mrr.MrQuaternion
         * @instance
         */
        MrQuaternion.prototype.x = 0;

        /**
         * MrQuaternion y.
         * @member {number} y
         * @memberof Mrr.MrQuaternion
         * @instance
         */
        MrQuaternion.prototype.y = 0;

        /**
         * MrQuaternion z.
         * @member {number} z
         * @memberof Mrr.MrQuaternion
         * @instance
         */
        MrQuaternion.prototype.z = 0;

        /**
         * Creates a new MrQuaternion instance using the specified properties.
         * @function create
         * @memberof Mrr.MrQuaternion
         * @static
         * @param {Mrr.IMrQuaternion=} [properties] Properties to set
         * @returns {Mrr.MrQuaternion} MrQuaternion instance
         */
        MrQuaternion.create = function create(properties) {
            return new MrQuaternion(properties);
        };

        /**
         * Encodes the specified MrQuaternion message. Does not implicitly {@link Mrr.MrQuaternion.verify|verify} messages.
         * @function encode
         * @memberof Mrr.MrQuaternion
         * @static
         * @param {Mrr.IMrQuaternion} message MrQuaternion message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrQuaternion.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 5 =*/13).float(message.w);
            writer.uint32(/* id 2, wireType 5 =*/21).float(message.x);
            writer.uint32(/* id 3, wireType 5 =*/29).float(message.y);
            writer.uint32(/* id 4, wireType 5 =*/37).float(message.z);
            return writer;
        };

        /**
         * Encodes the specified MrQuaternion message, length delimited. Does not implicitly {@link Mrr.MrQuaternion.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Mrr.MrQuaternion
         * @static
         * @param {Mrr.IMrQuaternion} message MrQuaternion message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrQuaternion.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MrQuaternion message from the specified reader or buffer.
         * @function decode
         * @memberof Mrr.MrQuaternion
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Mrr.MrQuaternion} MrQuaternion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrQuaternion.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Mrr.MrQuaternion();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.w = reader.float();
                        break;
                    }
                case 2: {
                        message.x = reader.float();
                        break;
                    }
                case 3: {
                        message.y = reader.float();
                        break;
                    }
                case 4: {
                        message.z = reader.float();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("w"))
                throw $util.ProtocolError("missing required 'w'", { instance: message });
            if (!message.hasOwnProperty("x"))
                throw $util.ProtocolError("missing required 'x'", { instance: message });
            if (!message.hasOwnProperty("y"))
                throw $util.ProtocolError("missing required 'y'", { instance: message });
            if (!message.hasOwnProperty("z"))
                throw $util.ProtocolError("missing required 'z'", { instance: message });
            return message;
        };

        /**
         * Decodes a MrQuaternion message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Mrr.MrQuaternion
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Mrr.MrQuaternion} MrQuaternion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrQuaternion.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MrQuaternion message.
         * @function verify
         * @memberof Mrr.MrQuaternion
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MrQuaternion.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (typeof message.w !== "number")
                return "w: number expected";
            if (typeof message.x !== "number")
                return "x: number expected";
            if (typeof message.y !== "number")
                return "y: number expected";
            if (typeof message.z !== "number")
                return "z: number expected";
            return null;
        };

        /**
         * Creates a MrQuaternion message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Mrr.MrQuaternion
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Mrr.MrQuaternion} MrQuaternion
         */
        MrQuaternion.fromObject = function fromObject(object) {
            if (object instanceof $root.Mrr.MrQuaternion)
                return object;
            let message = new $root.Mrr.MrQuaternion();
            if (object.w != null)
                message.w = Number(object.w);
            if (object.x != null)
                message.x = Number(object.x);
            if (object.y != null)
                message.y = Number(object.y);
            if (object.z != null)
                message.z = Number(object.z);
            return message;
        };

        /**
         * Creates a plain object from a MrQuaternion message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Mrr.MrQuaternion
         * @static
         * @param {Mrr.MrQuaternion} message MrQuaternion
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MrQuaternion.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.w = 0;
                object.x = 0;
                object.y = 0;
                object.z = 0;
            }
            if (message.w != null && message.hasOwnProperty("w"))
                object.w = options.json && !isFinite(message.w) ? String(message.w) : message.w;
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
            if (message.z != null && message.hasOwnProperty("z"))
                object.z = options.json && !isFinite(message.z) ? String(message.z) : message.z;
            return object;
        };

        /**
         * Converts this MrQuaternion to JSON.
         * @function toJSON
         * @memberof Mrr.MrQuaternion
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MrQuaternion.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MrQuaternion
         * @function getTypeUrl
         * @memberof Mrr.MrQuaternion
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MrQuaternion.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Mrr.MrQuaternion";
        };

        return MrQuaternion;
    })();

    Mrr.MrModel = (function() {

        /**
         * Properties of a MrModel.
         * @memberof Mrr
         * @interface IMrModel
         * @property {string} id MrModel id
         * @property {string} name MrModel name
         * @property {Mrr.IMrTransform} transform MrModel transform
         * @property {Mrr.IMrShaderProgram} shaderProgram MrModel shaderProgram
         * @property {Mrr.IMrMesh} mesh MrModel mesh
         */

        /**
         * Constructs a new MrModel.
         * @memberof Mrr
         * @classdesc Represents a MrModel.
         * @implements IMrModel
         * @constructor
         * @param {Mrr.IMrModel=} [properties] Properties to set
         */
        function MrModel(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MrModel id.
         * @member {string} id
         * @memberof Mrr.MrModel
         * @instance
         */
        MrModel.prototype.id = "";

        /**
         * MrModel name.
         * @member {string} name
         * @memberof Mrr.MrModel
         * @instance
         */
        MrModel.prototype.name = "";

        /**
         * MrModel transform.
         * @member {Mrr.IMrTransform} transform
         * @memberof Mrr.MrModel
         * @instance
         */
        MrModel.prototype.transform = null;

        /**
         * MrModel shaderProgram.
         * @member {Mrr.IMrShaderProgram} shaderProgram
         * @memberof Mrr.MrModel
         * @instance
         */
        MrModel.prototype.shaderProgram = null;

        /**
         * MrModel mesh.
         * @member {Mrr.IMrMesh} mesh
         * @memberof Mrr.MrModel
         * @instance
         */
        MrModel.prototype.mesh = null;

        /**
         * Creates a new MrModel instance using the specified properties.
         * @function create
         * @memberof Mrr.MrModel
         * @static
         * @param {Mrr.IMrModel=} [properties] Properties to set
         * @returns {Mrr.MrModel} MrModel instance
         */
        MrModel.create = function create(properties) {
            return new MrModel(properties);
        };

        /**
         * Encodes the specified MrModel message. Does not implicitly {@link Mrr.MrModel.verify|verify} messages.
         * @function encode
         * @memberof Mrr.MrModel
         * @static
         * @param {Mrr.IMrModel} message MrModel message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrModel.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            $root.Mrr.MrTransform.encode(message.transform, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            $root.Mrr.MrShaderProgram.encode(message.shaderProgram, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            $root.Mrr.MrMesh.encode(message.mesh, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified MrModel message, length delimited. Does not implicitly {@link Mrr.MrModel.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Mrr.MrModel
         * @static
         * @param {Mrr.IMrModel} message MrModel message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrModel.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MrModel message from the specified reader or buffer.
         * @function decode
         * @memberof Mrr.MrModel
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Mrr.MrModel} MrModel
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrModel.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Mrr.MrModel();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.transform = $root.Mrr.MrTransform.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.shaderProgram = $root.Mrr.MrShaderProgram.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.mesh = $root.Mrr.MrMesh.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("id"))
                throw $util.ProtocolError("missing required 'id'", { instance: message });
            if (!message.hasOwnProperty("name"))
                throw $util.ProtocolError("missing required 'name'", { instance: message });
            if (!message.hasOwnProperty("transform"))
                throw $util.ProtocolError("missing required 'transform'", { instance: message });
            if (!message.hasOwnProperty("shaderProgram"))
                throw $util.ProtocolError("missing required 'shaderProgram'", { instance: message });
            if (!message.hasOwnProperty("mesh"))
                throw $util.ProtocolError("missing required 'mesh'", { instance: message });
            return message;
        };

        /**
         * Decodes a MrModel message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Mrr.MrModel
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Mrr.MrModel} MrModel
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrModel.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MrModel message.
         * @function verify
         * @memberof Mrr.MrModel
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MrModel.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.id))
                return "id: string expected";
            if (!$util.isString(message.name))
                return "name: string expected";
            {
                let error = $root.Mrr.MrTransform.verify(message.transform);
                if (error)
                    return "transform." + error;
            }
            {
                let error = $root.Mrr.MrShaderProgram.verify(message.shaderProgram);
                if (error)
                    return "shaderProgram." + error;
            }
            {
                let error = $root.Mrr.MrMesh.verify(message.mesh);
                if (error)
                    return "mesh." + error;
            }
            return null;
        };

        /**
         * Creates a MrModel message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Mrr.MrModel
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Mrr.MrModel} MrModel
         */
        MrModel.fromObject = function fromObject(object) {
            if (object instanceof $root.Mrr.MrModel)
                return object;
            let message = new $root.Mrr.MrModel();
            if (object.id != null)
                message.id = String(object.id);
            if (object.name != null)
                message.name = String(object.name);
            if (object.transform != null) {
                if (typeof object.transform !== "object")
                    throw TypeError(".Mrr.MrModel.transform: object expected");
                message.transform = $root.Mrr.MrTransform.fromObject(object.transform);
            }
            if (object.shaderProgram != null) {
                if (typeof object.shaderProgram !== "object")
                    throw TypeError(".Mrr.MrModel.shaderProgram: object expected");
                message.shaderProgram = $root.Mrr.MrShaderProgram.fromObject(object.shaderProgram);
            }
            if (object.mesh != null) {
                if (typeof object.mesh !== "object")
                    throw TypeError(".Mrr.MrModel.mesh: object expected");
                message.mesh = $root.Mrr.MrMesh.fromObject(object.mesh);
            }
            return message;
        };

        /**
         * Creates a plain object from a MrModel message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Mrr.MrModel
         * @static
         * @param {Mrr.MrModel} message MrModel
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MrModel.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = "";
                object.name = "";
                object.transform = null;
                object.shaderProgram = null;
                object.mesh = null;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.transform != null && message.hasOwnProperty("transform"))
                object.transform = $root.Mrr.MrTransform.toObject(message.transform, options);
            if (message.shaderProgram != null && message.hasOwnProperty("shaderProgram"))
                object.shaderProgram = $root.Mrr.MrShaderProgram.toObject(message.shaderProgram, options);
            if (message.mesh != null && message.hasOwnProperty("mesh"))
                object.mesh = $root.Mrr.MrMesh.toObject(message.mesh, options);
            return object;
        };

        /**
         * Converts this MrModel to JSON.
         * @function toJSON
         * @memberof Mrr.MrModel
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MrModel.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MrModel
         * @function getTypeUrl
         * @memberof Mrr.MrModel
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MrModel.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Mrr.MrModel";
        };

        return MrModel;
    })();

    Mrr.MrMesh = (function() {

        /**
         * Properties of a MrMesh.
         * @memberof Mrr
         * @interface IMrMesh
         * @property {Object.<string,Mrr.IMrAttributeKey>|null} [attributeKeys] MrMesh attributeKeys
         * @property {Mrr.IMrIndexBuffer} indices MrMesh indices
         * @property {Object.<string,Mrr.IMrVertexBuffer>|null} [vertices] MrMesh vertices
         */

        /**
         * Constructs a new MrMesh.
         * @memberof Mrr
         * @classdesc Represents a MrMesh.
         * @implements IMrMesh
         * @constructor
         * @param {Mrr.IMrMesh=} [properties] Properties to set
         */
        function MrMesh(properties) {
            this.attributeKeys = {};
            this.vertices = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MrMesh attributeKeys.
         * @member {Object.<string,Mrr.IMrAttributeKey>} attributeKeys
         * @memberof Mrr.MrMesh
         * @instance
         */
        MrMesh.prototype.attributeKeys = $util.emptyObject;

        /**
         * MrMesh indices.
         * @member {Mrr.IMrIndexBuffer} indices
         * @memberof Mrr.MrMesh
         * @instance
         */
        MrMesh.prototype.indices = null;

        /**
         * MrMesh vertices.
         * @member {Object.<string,Mrr.IMrVertexBuffer>} vertices
         * @memberof Mrr.MrMesh
         * @instance
         */
        MrMesh.prototype.vertices = $util.emptyObject;

        /**
         * Creates a new MrMesh instance using the specified properties.
         * @function create
         * @memberof Mrr.MrMesh
         * @static
         * @param {Mrr.IMrMesh=} [properties] Properties to set
         * @returns {Mrr.MrMesh} MrMesh instance
         */
        MrMesh.create = function create(properties) {
            return new MrMesh(properties);
        };

        /**
         * Encodes the specified MrMesh message. Does not implicitly {@link Mrr.MrMesh.verify|verify} messages.
         * @function encode
         * @memberof Mrr.MrMesh
         * @static
         * @param {Mrr.IMrMesh} message MrMesh message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrMesh.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.attributeKeys != null && Object.hasOwnProperty.call(message, "attributeKeys"))
                for (let keys = Object.keys(message.attributeKeys), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.Mrr.MrAttributeKey.encode(message.attributeKeys[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                }
            $root.Mrr.MrIndexBuffer.encode(message.indices, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.vertices != null && Object.hasOwnProperty.call(message, "vertices"))
                for (let keys = Object.keys(message.vertices), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 3, wireType 2 =*/26).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.Mrr.MrVertexBuffer.encode(message.vertices[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                }
            return writer;
        };

        /**
         * Encodes the specified MrMesh message, length delimited. Does not implicitly {@link Mrr.MrMesh.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Mrr.MrMesh
         * @static
         * @param {Mrr.IMrMesh} message MrMesh message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrMesh.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MrMesh message from the specified reader or buffer.
         * @function decode
         * @memberof Mrr.MrMesh
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Mrr.MrMesh} MrMesh
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrMesh.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Mrr.MrMesh(), key, value;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (message.attributeKeys === $util.emptyObject)
                            message.attributeKeys = {};
                        let end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = null;
                        while (reader.pos < end2) {
                            let tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = $root.Mrr.MrAttributeKey.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.attributeKeys[key] = value;
                        break;
                    }
                case 2: {
                        message.indices = $root.Mrr.MrIndexBuffer.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        if (message.vertices === $util.emptyObject)
                            message.vertices = {};
                        let end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = null;
                        while (reader.pos < end2) {
                            let tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = $root.Mrr.MrVertexBuffer.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.vertices[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("indices"))
                throw $util.ProtocolError("missing required 'indices'", { instance: message });
            return message;
        };

        /**
         * Decodes a MrMesh message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Mrr.MrMesh
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Mrr.MrMesh} MrMesh
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrMesh.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MrMesh message.
         * @function verify
         * @memberof Mrr.MrMesh
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MrMesh.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.attributeKeys != null && message.hasOwnProperty("attributeKeys")) {
                if (!$util.isObject(message.attributeKeys))
                    return "attributeKeys: object expected";
                let key = Object.keys(message.attributeKeys);
                for (let i = 0; i < key.length; ++i) {
                    let error = $root.Mrr.MrAttributeKey.verify(message.attributeKeys[key[i]]);
                    if (error)
                        return "attributeKeys." + error;
                }
            }
            {
                let error = $root.Mrr.MrIndexBuffer.verify(message.indices);
                if (error)
                    return "indices." + error;
            }
            if (message.vertices != null && message.hasOwnProperty("vertices")) {
                if (!$util.isObject(message.vertices))
                    return "vertices: object expected";
                let key = Object.keys(message.vertices);
                for (let i = 0; i < key.length; ++i) {
                    let error = $root.Mrr.MrVertexBuffer.verify(message.vertices[key[i]]);
                    if (error)
                        return "vertices." + error;
                }
            }
            return null;
        };

        /**
         * Creates a MrMesh message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Mrr.MrMesh
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Mrr.MrMesh} MrMesh
         */
        MrMesh.fromObject = function fromObject(object) {
            if (object instanceof $root.Mrr.MrMesh)
                return object;
            let message = new $root.Mrr.MrMesh();
            if (object.attributeKeys) {
                if (typeof object.attributeKeys !== "object")
                    throw TypeError(".Mrr.MrMesh.attributeKeys: object expected");
                message.attributeKeys = {};
                for (let keys = Object.keys(object.attributeKeys), i = 0; i < keys.length; ++i) {
                    if (typeof object.attributeKeys[keys[i]] !== "object")
                        throw TypeError(".Mrr.MrMesh.attributeKeys: object expected");
                    message.attributeKeys[keys[i]] = $root.Mrr.MrAttributeKey.fromObject(object.attributeKeys[keys[i]]);
                }
            }
            if (object.indices != null) {
                if (typeof object.indices !== "object")
                    throw TypeError(".Mrr.MrMesh.indices: object expected");
                message.indices = $root.Mrr.MrIndexBuffer.fromObject(object.indices);
            }
            if (object.vertices) {
                if (typeof object.vertices !== "object")
                    throw TypeError(".Mrr.MrMesh.vertices: object expected");
                message.vertices = {};
                for (let keys = Object.keys(object.vertices), i = 0; i < keys.length; ++i) {
                    if (typeof object.vertices[keys[i]] !== "object")
                        throw TypeError(".Mrr.MrMesh.vertices: object expected");
                    message.vertices[keys[i]] = $root.Mrr.MrVertexBuffer.fromObject(object.vertices[keys[i]]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a MrMesh message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Mrr.MrMesh
         * @static
         * @param {Mrr.MrMesh} message MrMesh
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MrMesh.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults) {
                object.attributeKeys = {};
                object.vertices = {};
            }
            if (options.defaults)
                object.indices = null;
            let keys2;
            if (message.attributeKeys && (keys2 = Object.keys(message.attributeKeys)).length) {
                object.attributeKeys = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.attributeKeys[keys2[j]] = $root.Mrr.MrAttributeKey.toObject(message.attributeKeys[keys2[j]], options);
            }
            if (message.indices != null && message.hasOwnProperty("indices"))
                object.indices = $root.Mrr.MrIndexBuffer.toObject(message.indices, options);
            if (message.vertices && (keys2 = Object.keys(message.vertices)).length) {
                object.vertices = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.vertices[keys2[j]] = $root.Mrr.MrVertexBuffer.toObject(message.vertices[keys2[j]], options);
            }
            return object;
        };

        /**
         * Converts this MrMesh to JSON.
         * @function toJSON
         * @memberof Mrr.MrMesh
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MrMesh.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MrMesh
         * @function getTypeUrl
         * @memberof Mrr.MrMesh
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MrMesh.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Mrr.MrMesh";
        };

        return MrMesh;
    })();

    Mrr.MrAttributeKey = (function() {

        /**
         * Properties of a MrAttributeKey.
         * @memberof Mrr
         * @interface IMrAttributeKey
         * @property {number} index MrAttributeKey index
         * @property {number} size MrAttributeKey size
         * @property {number} count MrAttributeKey count
         * @property {boolean} normalized MrAttributeKey normalized
         * @property {number} offset MrAttributeKey offset
         * @property {number} stride MrAttributeKey stride
         */

        /**
         * Constructs a new MrAttributeKey.
         * @memberof Mrr
         * @classdesc Represents a MrAttributeKey.
         * @implements IMrAttributeKey
         * @constructor
         * @param {Mrr.IMrAttributeKey=} [properties] Properties to set
         */
        function MrAttributeKey(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MrAttributeKey index.
         * @member {number} index
         * @memberof Mrr.MrAttributeKey
         * @instance
         */
        MrAttributeKey.prototype.index = 0;

        /**
         * MrAttributeKey size.
         * @member {number} size
         * @memberof Mrr.MrAttributeKey
         * @instance
         */
        MrAttributeKey.prototype.size = 0;

        /**
         * MrAttributeKey count.
         * @member {number} count
         * @memberof Mrr.MrAttributeKey
         * @instance
         */
        MrAttributeKey.prototype.count = 0;

        /**
         * MrAttributeKey normalized.
         * @member {boolean} normalized
         * @memberof Mrr.MrAttributeKey
         * @instance
         */
        MrAttributeKey.prototype.normalized = false;

        /**
         * MrAttributeKey offset.
         * @member {number} offset
         * @memberof Mrr.MrAttributeKey
         * @instance
         */
        MrAttributeKey.prototype.offset = 0;

        /**
         * MrAttributeKey stride.
         * @member {number} stride
         * @memberof Mrr.MrAttributeKey
         * @instance
         */
        MrAttributeKey.prototype.stride = 0;

        /**
         * Creates a new MrAttributeKey instance using the specified properties.
         * @function create
         * @memberof Mrr.MrAttributeKey
         * @static
         * @param {Mrr.IMrAttributeKey=} [properties] Properties to set
         * @returns {Mrr.MrAttributeKey} MrAttributeKey instance
         */
        MrAttributeKey.create = function create(properties) {
            return new MrAttributeKey(properties);
        };

        /**
         * Encodes the specified MrAttributeKey message. Does not implicitly {@link Mrr.MrAttributeKey.verify|verify} messages.
         * @function encode
         * @memberof Mrr.MrAttributeKey
         * @static
         * @param {Mrr.IMrAttributeKey} message MrAttributeKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrAttributeKey.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.index);
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.size);
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.count);
            writer.uint32(/* id 4, wireType 0 =*/32).bool(message.normalized);
            writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.offset);
            writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.stride);
            return writer;
        };

        /**
         * Encodes the specified MrAttributeKey message, length delimited. Does not implicitly {@link Mrr.MrAttributeKey.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Mrr.MrAttributeKey
         * @static
         * @param {Mrr.IMrAttributeKey} message MrAttributeKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrAttributeKey.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MrAttributeKey message from the specified reader or buffer.
         * @function decode
         * @memberof Mrr.MrAttributeKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Mrr.MrAttributeKey} MrAttributeKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrAttributeKey.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Mrr.MrAttributeKey();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.index = reader.uint32();
                        break;
                    }
                case 2: {
                        message.size = reader.uint32();
                        break;
                    }
                case 3: {
                        message.count = reader.uint32();
                        break;
                    }
                case 4: {
                        message.normalized = reader.bool();
                        break;
                    }
                case 5: {
                        message.offset = reader.uint32();
                        break;
                    }
                case 6: {
                        message.stride = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("index"))
                throw $util.ProtocolError("missing required 'index'", { instance: message });
            if (!message.hasOwnProperty("size"))
                throw $util.ProtocolError("missing required 'size'", { instance: message });
            if (!message.hasOwnProperty("count"))
                throw $util.ProtocolError("missing required 'count'", { instance: message });
            if (!message.hasOwnProperty("normalized"))
                throw $util.ProtocolError("missing required 'normalized'", { instance: message });
            if (!message.hasOwnProperty("offset"))
                throw $util.ProtocolError("missing required 'offset'", { instance: message });
            if (!message.hasOwnProperty("stride"))
                throw $util.ProtocolError("missing required 'stride'", { instance: message });
            return message;
        };

        /**
         * Decodes a MrAttributeKey message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Mrr.MrAttributeKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Mrr.MrAttributeKey} MrAttributeKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrAttributeKey.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MrAttributeKey message.
         * @function verify
         * @memberof Mrr.MrAttributeKey
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MrAttributeKey.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.index))
                return "index: integer expected";
            if (!$util.isInteger(message.size))
                return "size: integer expected";
            if (!$util.isInteger(message.count))
                return "count: integer expected";
            if (typeof message.normalized !== "boolean")
                return "normalized: boolean expected";
            if (!$util.isInteger(message.offset))
                return "offset: integer expected";
            if (!$util.isInteger(message.stride))
                return "stride: integer expected";
            return null;
        };

        /**
         * Creates a MrAttributeKey message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Mrr.MrAttributeKey
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Mrr.MrAttributeKey} MrAttributeKey
         */
        MrAttributeKey.fromObject = function fromObject(object) {
            if (object instanceof $root.Mrr.MrAttributeKey)
                return object;
            let message = new $root.Mrr.MrAttributeKey();
            if (object.index != null)
                message.index = object.index >>> 0;
            if (object.size != null)
                message.size = object.size >>> 0;
            if (object.count != null)
                message.count = object.count >>> 0;
            if (object.normalized != null)
                message.normalized = Boolean(object.normalized);
            if (object.offset != null)
                message.offset = object.offset >>> 0;
            if (object.stride != null)
                message.stride = object.stride >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a MrAttributeKey message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Mrr.MrAttributeKey
         * @static
         * @param {Mrr.MrAttributeKey} message MrAttributeKey
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MrAttributeKey.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.index = 0;
                object.size = 0;
                object.count = 0;
                object.normalized = false;
                object.offset = 0;
                object.stride = 0;
            }
            if (message.index != null && message.hasOwnProperty("index"))
                object.index = message.index;
            if (message.size != null && message.hasOwnProperty("size"))
                object.size = message.size;
            if (message.count != null && message.hasOwnProperty("count"))
                object.count = message.count;
            if (message.normalized != null && message.hasOwnProperty("normalized"))
                object.normalized = message.normalized;
            if (message.offset != null && message.hasOwnProperty("offset"))
                object.offset = message.offset;
            if (message.stride != null && message.hasOwnProperty("stride"))
                object.stride = message.stride;
            return object;
        };

        /**
         * Converts this MrAttributeKey to JSON.
         * @function toJSON
         * @memberof Mrr.MrAttributeKey
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MrAttributeKey.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MrAttributeKey
         * @function getTypeUrl
         * @memberof Mrr.MrAttributeKey
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MrAttributeKey.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Mrr.MrAttributeKey";
        };

        return MrAttributeKey;
    })();

    /**
     * BufferTargetType enum.
     * @name Mrr.BufferTargetType
     * @enum {number}
     * @property {number} ARRAY_BUFFER=0 ARRAY_BUFFER value
     * @property {number} ELEMENT_ARRAY_BUFFER=1 ELEMENT_ARRAY_BUFFER value
     */
    Mrr.BufferTargetType = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "ARRAY_BUFFER"] = 0;
        values[valuesById[1] = "ELEMENT_ARRAY_BUFFER"] = 1;
        return values;
    })();

    /**
     * BufferUsageType enum.
     * @name Mrr.BufferUsageType
     * @enum {number}
     * @property {number} STATIC_DRAW=0 STATIC_DRAW value
     */
    Mrr.BufferUsageType = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "STATIC_DRAW"] = 0;
        return values;
    })();

    Mrr.MrIndexBuffer = (function() {

        /**
         * Properties of a MrIndexBuffer.
         * @memberof Mrr
         * @interface IMrIndexBuffer
         * @property {Mrr.BufferTargetType} targetBuffer MrIndexBuffer targetBuffer
         * @property {Mrr.BufferUsageType} usage MrIndexBuffer usage
         * @property {number} itemSize MrIndexBuffer itemSize
         * @property {number} count MrIndexBuffer count
         * @property {Uint8Array} dataArray MrIndexBuffer dataArray
         */

        /**
         * Constructs a new MrIndexBuffer.
         * @memberof Mrr
         * @classdesc Represents a MrIndexBuffer.
         * @implements IMrIndexBuffer
         * @constructor
         * @param {Mrr.IMrIndexBuffer=} [properties] Properties to set
         */
        function MrIndexBuffer(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MrIndexBuffer targetBuffer.
         * @member {Mrr.BufferTargetType} targetBuffer
         * @memberof Mrr.MrIndexBuffer
         * @instance
         */
        MrIndexBuffer.prototype.targetBuffer = 0;

        /**
         * MrIndexBuffer usage.
         * @member {Mrr.BufferUsageType} usage
         * @memberof Mrr.MrIndexBuffer
         * @instance
         */
        MrIndexBuffer.prototype.usage = 0;

        /**
         * MrIndexBuffer itemSize.
         * @member {number} itemSize
         * @memberof Mrr.MrIndexBuffer
         * @instance
         */
        MrIndexBuffer.prototype.itemSize = 0;

        /**
         * MrIndexBuffer count.
         * @member {number} count
         * @memberof Mrr.MrIndexBuffer
         * @instance
         */
        MrIndexBuffer.prototype.count = 0;

        /**
         * MrIndexBuffer dataArray.
         * @member {Uint8Array} dataArray
         * @memberof Mrr.MrIndexBuffer
         * @instance
         */
        MrIndexBuffer.prototype.dataArray = $util.newBuffer([]);

        /**
         * Creates a new MrIndexBuffer instance using the specified properties.
         * @function create
         * @memberof Mrr.MrIndexBuffer
         * @static
         * @param {Mrr.IMrIndexBuffer=} [properties] Properties to set
         * @returns {Mrr.MrIndexBuffer} MrIndexBuffer instance
         */
        MrIndexBuffer.create = function create(properties) {
            return new MrIndexBuffer(properties);
        };

        /**
         * Encodes the specified MrIndexBuffer message. Does not implicitly {@link Mrr.MrIndexBuffer.verify|verify} messages.
         * @function encode
         * @memberof Mrr.MrIndexBuffer
         * @static
         * @param {Mrr.IMrIndexBuffer} message MrIndexBuffer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrIndexBuffer.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.targetBuffer);
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.usage);
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.itemSize);
            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.count);
            writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.dataArray);
            return writer;
        };

        /**
         * Encodes the specified MrIndexBuffer message, length delimited. Does not implicitly {@link Mrr.MrIndexBuffer.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Mrr.MrIndexBuffer
         * @static
         * @param {Mrr.IMrIndexBuffer} message MrIndexBuffer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrIndexBuffer.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MrIndexBuffer message from the specified reader or buffer.
         * @function decode
         * @memberof Mrr.MrIndexBuffer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Mrr.MrIndexBuffer} MrIndexBuffer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrIndexBuffer.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Mrr.MrIndexBuffer();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.targetBuffer = reader.int32();
                        break;
                    }
                case 2: {
                        message.usage = reader.int32();
                        break;
                    }
                case 3: {
                        message.itemSize = reader.uint32();
                        break;
                    }
                case 4: {
                        message.count = reader.uint32();
                        break;
                    }
                case 5: {
                        message.dataArray = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("targetBuffer"))
                throw $util.ProtocolError("missing required 'targetBuffer'", { instance: message });
            if (!message.hasOwnProperty("usage"))
                throw $util.ProtocolError("missing required 'usage'", { instance: message });
            if (!message.hasOwnProperty("itemSize"))
                throw $util.ProtocolError("missing required 'itemSize'", { instance: message });
            if (!message.hasOwnProperty("count"))
                throw $util.ProtocolError("missing required 'count'", { instance: message });
            if (!message.hasOwnProperty("dataArray"))
                throw $util.ProtocolError("missing required 'dataArray'", { instance: message });
            return message;
        };

        /**
         * Decodes a MrIndexBuffer message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Mrr.MrIndexBuffer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Mrr.MrIndexBuffer} MrIndexBuffer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrIndexBuffer.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MrIndexBuffer message.
         * @function verify
         * @memberof Mrr.MrIndexBuffer
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MrIndexBuffer.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            switch (message.targetBuffer) {
            default:
                return "targetBuffer: enum value expected";
            case 0:
            case 1:
                break;
            }
            switch (message.usage) {
            default:
                return "usage: enum value expected";
            case 0:
                break;
            }
            if (!$util.isInteger(message.itemSize))
                return "itemSize: integer expected";
            if (!$util.isInteger(message.count))
                return "count: integer expected";
            if (!(message.dataArray && typeof message.dataArray.length === "number" || $util.isString(message.dataArray)))
                return "dataArray: buffer expected";
            return null;
        };

        /**
         * Creates a MrIndexBuffer message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Mrr.MrIndexBuffer
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Mrr.MrIndexBuffer} MrIndexBuffer
         */
        MrIndexBuffer.fromObject = function fromObject(object) {
            if (object instanceof $root.Mrr.MrIndexBuffer)
                return object;
            let message = new $root.Mrr.MrIndexBuffer();
            switch (object.targetBuffer) {
            default:
                if (typeof object.targetBuffer === "number") {
                    message.targetBuffer = object.targetBuffer;
                    break;
                }
                break;
            case "ARRAY_BUFFER":
            case 0:
                message.targetBuffer = 0;
                break;
            case "ELEMENT_ARRAY_BUFFER":
            case 1:
                message.targetBuffer = 1;
                break;
            }
            switch (object.usage) {
            default:
                if (typeof object.usage === "number") {
                    message.usage = object.usage;
                    break;
                }
                break;
            case "STATIC_DRAW":
            case 0:
                message.usage = 0;
                break;
            }
            if (object.itemSize != null)
                message.itemSize = object.itemSize >>> 0;
            if (object.count != null)
                message.count = object.count >>> 0;
            if (object.dataArray != null)
                if (typeof object.dataArray === "string")
                    $util.base64.decode(object.dataArray, message.dataArray = $util.newBuffer($util.base64.length(object.dataArray)), 0);
                else if (object.dataArray.length >= 0)
                    message.dataArray = object.dataArray;
            return message;
        };

        /**
         * Creates a plain object from a MrIndexBuffer message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Mrr.MrIndexBuffer
         * @static
         * @param {Mrr.MrIndexBuffer} message MrIndexBuffer
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MrIndexBuffer.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.targetBuffer = options.enums === String ? "ARRAY_BUFFER" : 0;
                object.usage = options.enums === String ? "STATIC_DRAW" : 0;
                object.itemSize = 0;
                object.count = 0;
                if (options.bytes === String)
                    object.dataArray = "";
                else {
                    object.dataArray = [];
                    if (options.bytes !== Array)
                        object.dataArray = $util.newBuffer(object.dataArray);
                }
            }
            if (message.targetBuffer != null && message.hasOwnProperty("targetBuffer"))
                object.targetBuffer = options.enums === String ? $root.Mrr.BufferTargetType[message.targetBuffer] === undefined ? message.targetBuffer : $root.Mrr.BufferTargetType[message.targetBuffer] : message.targetBuffer;
            if (message.usage != null && message.hasOwnProperty("usage"))
                object.usage = options.enums === String ? $root.Mrr.BufferUsageType[message.usage] === undefined ? message.usage : $root.Mrr.BufferUsageType[message.usage] : message.usage;
            if (message.itemSize != null && message.hasOwnProperty("itemSize"))
                object.itemSize = message.itemSize;
            if (message.count != null && message.hasOwnProperty("count"))
                object.count = message.count;
            if (message.dataArray != null && message.hasOwnProperty("dataArray"))
                object.dataArray = options.bytes === String ? $util.base64.encode(message.dataArray, 0, message.dataArray.length) : options.bytes === Array ? Array.prototype.slice.call(message.dataArray) : message.dataArray;
            return object;
        };

        /**
         * Converts this MrIndexBuffer to JSON.
         * @function toJSON
         * @memberof Mrr.MrIndexBuffer
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MrIndexBuffer.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MrIndexBuffer
         * @function getTypeUrl
         * @memberof Mrr.MrIndexBuffer
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MrIndexBuffer.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Mrr.MrIndexBuffer";
        };

        return MrIndexBuffer;
    })();

    Mrr.MrVertexBuffer = (function() {

        /**
         * Properties of a MrVertexBuffer.
         * @memberof Mrr
         * @interface IMrVertexBuffer
         * @property {Mrr.BufferTargetType} targetBuffer MrVertexBuffer targetBuffer
         * @property {Mrr.BufferUsageType} usage MrVertexBuffer usage
         * @property {number} itemSize MrVertexBuffer itemSize
         * @property {number} count MrVertexBuffer count
         * @property {Uint8Array} dataArray MrVertexBuffer dataArray
         */

        /**
         * Constructs a new MrVertexBuffer.
         * @memberof Mrr
         * @classdesc Represents a MrVertexBuffer.
         * @implements IMrVertexBuffer
         * @constructor
         * @param {Mrr.IMrVertexBuffer=} [properties] Properties to set
         */
        function MrVertexBuffer(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MrVertexBuffer targetBuffer.
         * @member {Mrr.BufferTargetType} targetBuffer
         * @memberof Mrr.MrVertexBuffer
         * @instance
         */
        MrVertexBuffer.prototype.targetBuffer = 0;

        /**
         * MrVertexBuffer usage.
         * @member {Mrr.BufferUsageType} usage
         * @memberof Mrr.MrVertexBuffer
         * @instance
         */
        MrVertexBuffer.prototype.usage = 0;

        /**
         * MrVertexBuffer itemSize.
         * @member {number} itemSize
         * @memberof Mrr.MrVertexBuffer
         * @instance
         */
        MrVertexBuffer.prototype.itemSize = 0;

        /**
         * MrVertexBuffer count.
         * @member {number} count
         * @memberof Mrr.MrVertexBuffer
         * @instance
         */
        MrVertexBuffer.prototype.count = 0;

        /**
         * MrVertexBuffer dataArray.
         * @member {Uint8Array} dataArray
         * @memberof Mrr.MrVertexBuffer
         * @instance
         */
        MrVertexBuffer.prototype.dataArray = $util.newBuffer([]);

        /**
         * Creates a new MrVertexBuffer instance using the specified properties.
         * @function create
         * @memberof Mrr.MrVertexBuffer
         * @static
         * @param {Mrr.IMrVertexBuffer=} [properties] Properties to set
         * @returns {Mrr.MrVertexBuffer} MrVertexBuffer instance
         */
        MrVertexBuffer.create = function create(properties) {
            return new MrVertexBuffer(properties);
        };

        /**
         * Encodes the specified MrVertexBuffer message. Does not implicitly {@link Mrr.MrVertexBuffer.verify|verify} messages.
         * @function encode
         * @memberof Mrr.MrVertexBuffer
         * @static
         * @param {Mrr.IMrVertexBuffer} message MrVertexBuffer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrVertexBuffer.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.targetBuffer);
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.usage);
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.itemSize);
            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.count);
            writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.dataArray);
            return writer;
        };

        /**
         * Encodes the specified MrVertexBuffer message, length delimited. Does not implicitly {@link Mrr.MrVertexBuffer.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Mrr.MrVertexBuffer
         * @static
         * @param {Mrr.IMrVertexBuffer} message MrVertexBuffer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrVertexBuffer.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MrVertexBuffer message from the specified reader or buffer.
         * @function decode
         * @memberof Mrr.MrVertexBuffer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Mrr.MrVertexBuffer} MrVertexBuffer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrVertexBuffer.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Mrr.MrVertexBuffer();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.targetBuffer = reader.int32();
                        break;
                    }
                case 2: {
                        message.usage = reader.int32();
                        break;
                    }
                case 3: {
                        message.itemSize = reader.uint32();
                        break;
                    }
                case 4: {
                        message.count = reader.uint32();
                        break;
                    }
                case 5: {
                        message.dataArray = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("targetBuffer"))
                throw $util.ProtocolError("missing required 'targetBuffer'", { instance: message });
            if (!message.hasOwnProperty("usage"))
                throw $util.ProtocolError("missing required 'usage'", { instance: message });
            if (!message.hasOwnProperty("itemSize"))
                throw $util.ProtocolError("missing required 'itemSize'", { instance: message });
            if (!message.hasOwnProperty("count"))
                throw $util.ProtocolError("missing required 'count'", { instance: message });
            if (!message.hasOwnProperty("dataArray"))
                throw $util.ProtocolError("missing required 'dataArray'", { instance: message });
            return message;
        };

        /**
         * Decodes a MrVertexBuffer message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Mrr.MrVertexBuffer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Mrr.MrVertexBuffer} MrVertexBuffer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrVertexBuffer.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MrVertexBuffer message.
         * @function verify
         * @memberof Mrr.MrVertexBuffer
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MrVertexBuffer.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            switch (message.targetBuffer) {
            default:
                return "targetBuffer: enum value expected";
            case 0:
            case 1:
                break;
            }
            switch (message.usage) {
            default:
                return "usage: enum value expected";
            case 0:
                break;
            }
            if (!$util.isInteger(message.itemSize))
                return "itemSize: integer expected";
            if (!$util.isInteger(message.count))
                return "count: integer expected";
            if (!(message.dataArray && typeof message.dataArray.length === "number" || $util.isString(message.dataArray)))
                return "dataArray: buffer expected";
            return null;
        };

        /**
         * Creates a MrVertexBuffer message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Mrr.MrVertexBuffer
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Mrr.MrVertexBuffer} MrVertexBuffer
         */
        MrVertexBuffer.fromObject = function fromObject(object) {
            if (object instanceof $root.Mrr.MrVertexBuffer)
                return object;
            let message = new $root.Mrr.MrVertexBuffer();
            switch (object.targetBuffer) {
            default:
                if (typeof object.targetBuffer === "number") {
                    message.targetBuffer = object.targetBuffer;
                    break;
                }
                break;
            case "ARRAY_BUFFER":
            case 0:
                message.targetBuffer = 0;
                break;
            case "ELEMENT_ARRAY_BUFFER":
            case 1:
                message.targetBuffer = 1;
                break;
            }
            switch (object.usage) {
            default:
                if (typeof object.usage === "number") {
                    message.usage = object.usage;
                    break;
                }
                break;
            case "STATIC_DRAW":
            case 0:
                message.usage = 0;
                break;
            }
            if (object.itemSize != null)
                message.itemSize = object.itemSize >>> 0;
            if (object.count != null)
                message.count = object.count >>> 0;
            if (object.dataArray != null)
                if (typeof object.dataArray === "string")
                    $util.base64.decode(object.dataArray, message.dataArray = $util.newBuffer($util.base64.length(object.dataArray)), 0);
                else if (object.dataArray.length >= 0)
                    message.dataArray = object.dataArray;
            return message;
        };

        /**
         * Creates a plain object from a MrVertexBuffer message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Mrr.MrVertexBuffer
         * @static
         * @param {Mrr.MrVertexBuffer} message MrVertexBuffer
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MrVertexBuffer.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.targetBuffer = options.enums === String ? "ARRAY_BUFFER" : 0;
                object.usage = options.enums === String ? "STATIC_DRAW" : 0;
                object.itemSize = 0;
                object.count = 0;
                if (options.bytes === String)
                    object.dataArray = "";
                else {
                    object.dataArray = [];
                    if (options.bytes !== Array)
                        object.dataArray = $util.newBuffer(object.dataArray);
                }
            }
            if (message.targetBuffer != null && message.hasOwnProperty("targetBuffer"))
                object.targetBuffer = options.enums === String ? $root.Mrr.BufferTargetType[message.targetBuffer] === undefined ? message.targetBuffer : $root.Mrr.BufferTargetType[message.targetBuffer] : message.targetBuffer;
            if (message.usage != null && message.hasOwnProperty("usage"))
                object.usage = options.enums === String ? $root.Mrr.BufferUsageType[message.usage] === undefined ? message.usage : $root.Mrr.BufferUsageType[message.usage] : message.usage;
            if (message.itemSize != null && message.hasOwnProperty("itemSize"))
                object.itemSize = message.itemSize;
            if (message.count != null && message.hasOwnProperty("count"))
                object.count = message.count;
            if (message.dataArray != null && message.hasOwnProperty("dataArray"))
                object.dataArray = options.bytes === String ? $util.base64.encode(message.dataArray, 0, message.dataArray.length) : options.bytes === Array ? Array.prototype.slice.call(message.dataArray) : message.dataArray;
            return object;
        };

        /**
         * Converts this MrVertexBuffer to JSON.
         * @function toJSON
         * @memberof Mrr.MrVertexBuffer
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MrVertexBuffer.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MrVertexBuffer
         * @function getTypeUrl
         * @memberof Mrr.MrVertexBuffer
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MrVertexBuffer.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Mrr.MrVertexBuffer";
        };

        return MrVertexBuffer;
    })();

    Mrr.MrShaderProgram = (function() {

        /**
         * Properties of a MrShaderProgram.
         * @memberof Mrr
         * @interface IMrShaderProgram
         * @property {Mrr.IMrShader} vertexShader MrShaderProgram vertexShader
         * @property {Mrr.IMrShader} fragmentShader MrShaderProgram fragmentShader
         * @property {Object.<string,Mrr.IMrShaderAttribute>|null} [attributes] MrShaderProgram attributes
         * @property {Object.<string,Mrr.IMrShaderUniform>|null} [uniforms] MrShaderProgram uniforms
         */

        /**
         * Constructs a new MrShaderProgram.
         * @memberof Mrr
         * @classdesc Represents a MrShaderProgram.
         * @implements IMrShaderProgram
         * @constructor
         * @param {Mrr.IMrShaderProgram=} [properties] Properties to set
         */
        function MrShaderProgram(properties) {
            this.attributes = {};
            this.uniforms = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MrShaderProgram vertexShader.
         * @member {Mrr.IMrShader} vertexShader
         * @memberof Mrr.MrShaderProgram
         * @instance
         */
        MrShaderProgram.prototype.vertexShader = null;

        /**
         * MrShaderProgram fragmentShader.
         * @member {Mrr.IMrShader} fragmentShader
         * @memberof Mrr.MrShaderProgram
         * @instance
         */
        MrShaderProgram.prototype.fragmentShader = null;

        /**
         * MrShaderProgram attributes.
         * @member {Object.<string,Mrr.IMrShaderAttribute>} attributes
         * @memberof Mrr.MrShaderProgram
         * @instance
         */
        MrShaderProgram.prototype.attributes = $util.emptyObject;

        /**
         * MrShaderProgram uniforms.
         * @member {Object.<string,Mrr.IMrShaderUniform>} uniforms
         * @memberof Mrr.MrShaderProgram
         * @instance
         */
        MrShaderProgram.prototype.uniforms = $util.emptyObject;

        /**
         * Creates a new MrShaderProgram instance using the specified properties.
         * @function create
         * @memberof Mrr.MrShaderProgram
         * @static
         * @param {Mrr.IMrShaderProgram=} [properties] Properties to set
         * @returns {Mrr.MrShaderProgram} MrShaderProgram instance
         */
        MrShaderProgram.create = function create(properties) {
            return new MrShaderProgram(properties);
        };

        /**
         * Encodes the specified MrShaderProgram message. Does not implicitly {@link Mrr.MrShaderProgram.verify|verify} messages.
         * @function encode
         * @memberof Mrr.MrShaderProgram
         * @static
         * @param {Mrr.IMrShaderProgram} message MrShaderProgram message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrShaderProgram.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            $root.Mrr.MrShader.encode(message.vertexShader, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            $root.Mrr.MrShader.encode(message.fragmentShader, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.attributes != null && Object.hasOwnProperty.call(message, "attributes"))
                for (let keys = Object.keys(message.attributes), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 3, wireType 2 =*/26).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.Mrr.MrShaderAttribute.encode(message.attributes[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                }
            if (message.uniforms != null && Object.hasOwnProperty.call(message, "uniforms"))
                for (let keys = Object.keys(message.uniforms), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 4, wireType 2 =*/34).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.Mrr.MrShaderUniform.encode(message.uniforms[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                }
            return writer;
        };

        /**
         * Encodes the specified MrShaderProgram message, length delimited. Does not implicitly {@link Mrr.MrShaderProgram.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Mrr.MrShaderProgram
         * @static
         * @param {Mrr.IMrShaderProgram} message MrShaderProgram message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrShaderProgram.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MrShaderProgram message from the specified reader or buffer.
         * @function decode
         * @memberof Mrr.MrShaderProgram
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Mrr.MrShaderProgram} MrShaderProgram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrShaderProgram.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Mrr.MrShaderProgram(), key, value;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.vertexShader = $root.Mrr.MrShader.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.fragmentShader = $root.Mrr.MrShader.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        if (message.attributes === $util.emptyObject)
                            message.attributes = {};
                        let end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = null;
                        while (reader.pos < end2) {
                            let tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = $root.Mrr.MrShaderAttribute.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.attributes[key] = value;
                        break;
                    }
                case 4: {
                        if (message.uniforms === $util.emptyObject)
                            message.uniforms = {};
                        let end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = null;
                        while (reader.pos < end2) {
                            let tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = $root.Mrr.MrShaderUniform.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.uniforms[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("vertexShader"))
                throw $util.ProtocolError("missing required 'vertexShader'", { instance: message });
            if (!message.hasOwnProperty("fragmentShader"))
                throw $util.ProtocolError("missing required 'fragmentShader'", { instance: message });
            return message;
        };

        /**
         * Decodes a MrShaderProgram message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Mrr.MrShaderProgram
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Mrr.MrShaderProgram} MrShaderProgram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrShaderProgram.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MrShaderProgram message.
         * @function verify
         * @memberof Mrr.MrShaderProgram
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MrShaderProgram.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            {
                let error = $root.Mrr.MrShader.verify(message.vertexShader);
                if (error)
                    return "vertexShader." + error;
            }
            {
                let error = $root.Mrr.MrShader.verify(message.fragmentShader);
                if (error)
                    return "fragmentShader." + error;
            }
            if (message.attributes != null && message.hasOwnProperty("attributes")) {
                if (!$util.isObject(message.attributes))
                    return "attributes: object expected";
                let key = Object.keys(message.attributes);
                for (let i = 0; i < key.length; ++i) {
                    let error = $root.Mrr.MrShaderAttribute.verify(message.attributes[key[i]]);
                    if (error)
                        return "attributes." + error;
                }
            }
            if (message.uniforms != null && message.hasOwnProperty("uniforms")) {
                if (!$util.isObject(message.uniforms))
                    return "uniforms: object expected";
                let key = Object.keys(message.uniforms);
                for (let i = 0; i < key.length; ++i) {
                    let error = $root.Mrr.MrShaderUniform.verify(message.uniforms[key[i]]);
                    if (error)
                        return "uniforms." + error;
                }
            }
            return null;
        };

        /**
         * Creates a MrShaderProgram message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Mrr.MrShaderProgram
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Mrr.MrShaderProgram} MrShaderProgram
         */
        MrShaderProgram.fromObject = function fromObject(object) {
            if (object instanceof $root.Mrr.MrShaderProgram)
                return object;
            let message = new $root.Mrr.MrShaderProgram();
            if (object.vertexShader != null) {
                if (typeof object.vertexShader !== "object")
                    throw TypeError(".Mrr.MrShaderProgram.vertexShader: object expected");
                message.vertexShader = $root.Mrr.MrShader.fromObject(object.vertexShader);
            }
            if (object.fragmentShader != null) {
                if (typeof object.fragmentShader !== "object")
                    throw TypeError(".Mrr.MrShaderProgram.fragmentShader: object expected");
                message.fragmentShader = $root.Mrr.MrShader.fromObject(object.fragmentShader);
            }
            if (object.attributes) {
                if (typeof object.attributes !== "object")
                    throw TypeError(".Mrr.MrShaderProgram.attributes: object expected");
                message.attributes = {};
                for (let keys = Object.keys(object.attributes), i = 0; i < keys.length; ++i) {
                    if (typeof object.attributes[keys[i]] !== "object")
                        throw TypeError(".Mrr.MrShaderProgram.attributes: object expected");
                    message.attributes[keys[i]] = $root.Mrr.MrShaderAttribute.fromObject(object.attributes[keys[i]]);
                }
            }
            if (object.uniforms) {
                if (typeof object.uniforms !== "object")
                    throw TypeError(".Mrr.MrShaderProgram.uniforms: object expected");
                message.uniforms = {};
                for (let keys = Object.keys(object.uniforms), i = 0; i < keys.length; ++i) {
                    if (typeof object.uniforms[keys[i]] !== "object")
                        throw TypeError(".Mrr.MrShaderProgram.uniforms: object expected");
                    message.uniforms[keys[i]] = $root.Mrr.MrShaderUniform.fromObject(object.uniforms[keys[i]]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a MrShaderProgram message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Mrr.MrShaderProgram
         * @static
         * @param {Mrr.MrShaderProgram} message MrShaderProgram
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MrShaderProgram.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults) {
                object.attributes = {};
                object.uniforms = {};
            }
            if (options.defaults) {
                object.vertexShader = null;
                object.fragmentShader = null;
            }
            if (message.vertexShader != null && message.hasOwnProperty("vertexShader"))
                object.vertexShader = $root.Mrr.MrShader.toObject(message.vertexShader, options);
            if (message.fragmentShader != null && message.hasOwnProperty("fragmentShader"))
                object.fragmentShader = $root.Mrr.MrShader.toObject(message.fragmentShader, options);
            let keys2;
            if (message.attributes && (keys2 = Object.keys(message.attributes)).length) {
                object.attributes = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.attributes[keys2[j]] = $root.Mrr.MrShaderAttribute.toObject(message.attributes[keys2[j]], options);
            }
            if (message.uniforms && (keys2 = Object.keys(message.uniforms)).length) {
                object.uniforms = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.uniforms[keys2[j]] = $root.Mrr.MrShaderUniform.toObject(message.uniforms[keys2[j]], options);
            }
            return object;
        };

        /**
         * Converts this MrShaderProgram to JSON.
         * @function toJSON
         * @memberof Mrr.MrShaderProgram
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MrShaderProgram.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MrShaderProgram
         * @function getTypeUrl
         * @memberof Mrr.MrShaderProgram
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MrShaderProgram.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Mrr.MrShaderProgram";
        };

        return MrShaderProgram;
    })();

    Mrr.MrShader = (function() {

        /**
         * Properties of a MrShader.
         * @memberof Mrr
         * @interface IMrShader
         * @property {string} type MrShader type
         * @property {string} source MrShader source
         */

        /**
         * Constructs a new MrShader.
         * @memberof Mrr
         * @classdesc Represents a MrShader.
         * @implements IMrShader
         * @constructor
         * @param {Mrr.IMrShader=} [properties] Properties to set
         */
        function MrShader(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MrShader type.
         * @member {string} type
         * @memberof Mrr.MrShader
         * @instance
         */
        MrShader.prototype.type = "";

        /**
         * MrShader source.
         * @member {string} source
         * @memberof Mrr.MrShader
         * @instance
         */
        MrShader.prototype.source = "";

        /**
         * Creates a new MrShader instance using the specified properties.
         * @function create
         * @memberof Mrr.MrShader
         * @static
         * @param {Mrr.IMrShader=} [properties] Properties to set
         * @returns {Mrr.MrShader} MrShader instance
         */
        MrShader.create = function create(properties) {
            return new MrShader(properties);
        };

        /**
         * Encodes the specified MrShader message. Does not implicitly {@link Mrr.MrShader.verify|verify} messages.
         * @function encode
         * @memberof Mrr.MrShader
         * @static
         * @param {Mrr.IMrShader} message MrShader message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrShader.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.type);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.source);
            return writer;
        };

        /**
         * Encodes the specified MrShader message, length delimited. Does not implicitly {@link Mrr.MrShader.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Mrr.MrShader
         * @static
         * @param {Mrr.IMrShader} message MrShader message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrShader.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MrShader message from the specified reader or buffer.
         * @function decode
         * @memberof Mrr.MrShader
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Mrr.MrShader} MrShader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrShader.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Mrr.MrShader();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.type = reader.string();
                        break;
                    }
                case 2: {
                        message.source = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("type"))
                throw $util.ProtocolError("missing required 'type'", { instance: message });
            if (!message.hasOwnProperty("source"))
                throw $util.ProtocolError("missing required 'source'", { instance: message });
            return message;
        };

        /**
         * Decodes a MrShader message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Mrr.MrShader
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Mrr.MrShader} MrShader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrShader.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MrShader message.
         * @function verify
         * @memberof Mrr.MrShader
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MrShader.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.type))
                return "type: string expected";
            if (!$util.isString(message.source))
                return "source: string expected";
            return null;
        };

        /**
         * Creates a MrShader message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Mrr.MrShader
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Mrr.MrShader} MrShader
         */
        MrShader.fromObject = function fromObject(object) {
            if (object instanceof $root.Mrr.MrShader)
                return object;
            let message = new $root.Mrr.MrShader();
            if (object.type != null)
                message.type = String(object.type);
            if (object.source != null)
                message.source = String(object.source);
            return message;
        };

        /**
         * Creates a plain object from a MrShader message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Mrr.MrShader
         * @static
         * @param {Mrr.MrShader} message MrShader
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MrShader.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.type = "";
                object.source = "";
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.source != null && message.hasOwnProperty("source"))
                object.source = message.source;
            return object;
        };

        /**
         * Converts this MrShader to JSON.
         * @function toJSON
         * @memberof Mrr.MrShader
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MrShader.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MrShader
         * @function getTypeUrl
         * @memberof Mrr.MrShader
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MrShader.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Mrr.MrShader";
        };

        return MrShader;
    })();

    Mrr.MrShaderAttribute = (function() {

        /**
         * Properties of a MrShaderAttribute.
         * @memberof Mrr
         * @interface IMrShaderAttribute
         * @property {number} index MrShaderAttribute index
         * @property {string} attributeName MrShaderAttribute attributeName
         */

        /**
         * Constructs a new MrShaderAttribute.
         * @memberof Mrr
         * @classdesc Represents a MrShaderAttribute.
         * @implements IMrShaderAttribute
         * @constructor
         * @param {Mrr.IMrShaderAttribute=} [properties] Properties to set
         */
        function MrShaderAttribute(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MrShaderAttribute index.
         * @member {number} index
         * @memberof Mrr.MrShaderAttribute
         * @instance
         */
        MrShaderAttribute.prototype.index = 0;

        /**
         * MrShaderAttribute attributeName.
         * @member {string} attributeName
         * @memberof Mrr.MrShaderAttribute
         * @instance
         */
        MrShaderAttribute.prototype.attributeName = "";

        /**
         * Creates a new MrShaderAttribute instance using the specified properties.
         * @function create
         * @memberof Mrr.MrShaderAttribute
         * @static
         * @param {Mrr.IMrShaderAttribute=} [properties] Properties to set
         * @returns {Mrr.MrShaderAttribute} MrShaderAttribute instance
         */
        MrShaderAttribute.create = function create(properties) {
            return new MrShaderAttribute(properties);
        };

        /**
         * Encodes the specified MrShaderAttribute message. Does not implicitly {@link Mrr.MrShaderAttribute.verify|verify} messages.
         * @function encode
         * @memberof Mrr.MrShaderAttribute
         * @static
         * @param {Mrr.IMrShaderAttribute} message MrShaderAttribute message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrShaderAttribute.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.index);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.attributeName);
            return writer;
        };

        /**
         * Encodes the specified MrShaderAttribute message, length delimited. Does not implicitly {@link Mrr.MrShaderAttribute.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Mrr.MrShaderAttribute
         * @static
         * @param {Mrr.IMrShaderAttribute} message MrShaderAttribute message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrShaderAttribute.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MrShaderAttribute message from the specified reader or buffer.
         * @function decode
         * @memberof Mrr.MrShaderAttribute
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Mrr.MrShaderAttribute} MrShaderAttribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrShaderAttribute.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Mrr.MrShaderAttribute();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.index = reader.uint32();
                        break;
                    }
                case 2: {
                        message.attributeName = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("index"))
                throw $util.ProtocolError("missing required 'index'", { instance: message });
            if (!message.hasOwnProperty("attributeName"))
                throw $util.ProtocolError("missing required 'attributeName'", { instance: message });
            return message;
        };

        /**
         * Decodes a MrShaderAttribute message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Mrr.MrShaderAttribute
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Mrr.MrShaderAttribute} MrShaderAttribute
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrShaderAttribute.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MrShaderAttribute message.
         * @function verify
         * @memberof Mrr.MrShaderAttribute
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MrShaderAttribute.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.index))
                return "index: integer expected";
            if (!$util.isString(message.attributeName))
                return "attributeName: string expected";
            return null;
        };

        /**
         * Creates a MrShaderAttribute message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Mrr.MrShaderAttribute
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Mrr.MrShaderAttribute} MrShaderAttribute
         */
        MrShaderAttribute.fromObject = function fromObject(object) {
            if (object instanceof $root.Mrr.MrShaderAttribute)
                return object;
            let message = new $root.Mrr.MrShaderAttribute();
            if (object.index != null)
                message.index = object.index >>> 0;
            if (object.attributeName != null)
                message.attributeName = String(object.attributeName);
            return message;
        };

        /**
         * Creates a plain object from a MrShaderAttribute message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Mrr.MrShaderAttribute
         * @static
         * @param {Mrr.MrShaderAttribute} message MrShaderAttribute
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MrShaderAttribute.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.index = 0;
                object.attributeName = "";
            }
            if (message.index != null && message.hasOwnProperty("index"))
                object.index = message.index;
            if (message.attributeName != null && message.hasOwnProperty("attributeName"))
                object.attributeName = message.attributeName;
            return object;
        };

        /**
         * Converts this MrShaderAttribute to JSON.
         * @function toJSON
         * @memberof Mrr.MrShaderAttribute
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MrShaderAttribute.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MrShaderAttribute
         * @function getTypeUrl
         * @memberof Mrr.MrShaderAttribute
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MrShaderAttribute.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Mrr.MrShaderAttribute";
        };

        return MrShaderAttribute;
    })();

    Mrr.MrShaderUniform = (function() {

        /**
         * Properties of a MrShaderUniform.
         * @memberof Mrr
         * @interface IMrShaderUniform
         * @property {string} uniformName MrShaderUniform uniformName
         * @property {number} count MrShaderUniform count
         * @property {Mrr.MrUniformType} type MrShaderUniform type
         */

        /**
         * Constructs a new MrShaderUniform.
         * @memberof Mrr
         * @classdesc Represents a MrShaderUniform.
         * @implements IMrShaderUniform
         * @constructor
         * @param {Mrr.IMrShaderUniform=} [properties] Properties to set
         */
        function MrShaderUniform(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MrShaderUniform uniformName.
         * @member {string} uniformName
         * @memberof Mrr.MrShaderUniform
         * @instance
         */
        MrShaderUniform.prototype.uniformName = "";

        /**
         * MrShaderUniform count.
         * @member {number} count
         * @memberof Mrr.MrShaderUniform
         * @instance
         */
        MrShaderUniform.prototype.count = 0;

        /**
         * MrShaderUniform type.
         * @member {Mrr.MrUniformType} type
         * @memberof Mrr.MrShaderUniform
         * @instance
         */
        MrShaderUniform.prototype.type = 0;

        /**
         * Creates a new MrShaderUniform instance using the specified properties.
         * @function create
         * @memberof Mrr.MrShaderUniform
         * @static
         * @param {Mrr.IMrShaderUniform=} [properties] Properties to set
         * @returns {Mrr.MrShaderUniform} MrShaderUniform instance
         */
        MrShaderUniform.create = function create(properties) {
            return new MrShaderUniform(properties);
        };

        /**
         * Encodes the specified MrShaderUniform message. Does not implicitly {@link Mrr.MrShaderUniform.verify|verify} messages.
         * @function encode
         * @memberof Mrr.MrShaderUniform
         * @static
         * @param {Mrr.IMrShaderUniform} message MrShaderUniform message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrShaderUniform.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.uniformName);
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.count);
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.type);
            return writer;
        };

        /**
         * Encodes the specified MrShaderUniform message, length delimited. Does not implicitly {@link Mrr.MrShaderUniform.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Mrr.MrShaderUniform
         * @static
         * @param {Mrr.IMrShaderUniform} message MrShaderUniform message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MrShaderUniform.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MrShaderUniform message from the specified reader or buffer.
         * @function decode
         * @memberof Mrr.MrShaderUniform
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Mrr.MrShaderUniform} MrShaderUniform
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrShaderUniform.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Mrr.MrShaderUniform();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.uniformName = reader.string();
                        break;
                    }
                case 2: {
                        message.count = reader.uint32();
                        break;
                    }
                case 3: {
                        message.type = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("uniformName"))
                throw $util.ProtocolError("missing required 'uniformName'", { instance: message });
            if (!message.hasOwnProperty("count"))
                throw $util.ProtocolError("missing required 'count'", { instance: message });
            if (!message.hasOwnProperty("type"))
                throw $util.ProtocolError("missing required 'type'", { instance: message });
            return message;
        };

        /**
         * Decodes a MrShaderUniform message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Mrr.MrShaderUniform
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Mrr.MrShaderUniform} MrShaderUniform
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MrShaderUniform.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MrShaderUniform message.
         * @function verify
         * @memberof Mrr.MrShaderUniform
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MrShaderUniform.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.uniformName))
                return "uniformName: string expected";
            if (!$util.isInteger(message.count))
                return "count: integer expected";
            switch (message.type) {
            default:
                return "type: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                break;
            }
            return null;
        };

        /**
         * Creates a MrShaderUniform message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Mrr.MrShaderUniform
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Mrr.MrShaderUniform} MrShaderUniform
         */
        MrShaderUniform.fromObject = function fromObject(object) {
            if (object instanceof $root.Mrr.MrShaderUniform)
                return object;
            let message = new $root.Mrr.MrShaderUniform();
            if (object.uniformName != null)
                message.uniformName = String(object.uniformName);
            if (object.count != null)
                message.count = object.count >>> 0;
            switch (object.type) {
            default:
                if (typeof object.type === "number") {
                    message.type = object.type;
                    break;
                }
                break;
            case "SCALAR":
            case 0:
                message.type = 0;
                break;
            case "VEC2":
            case 1:
                message.type = 1;
                break;
            case "VEC3":
            case 2:
                message.type = 2;
                break;
            case "VEC4":
            case 3:
                message.type = 3;
                break;
            case "MAT2":
            case 4:
                message.type = 4;
                break;
            case "MAT3":
            case 5:
                message.type = 5;
                break;
            case "MAT4":
            case 6:
                message.type = 6;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a MrShaderUniform message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Mrr.MrShaderUniform
         * @static
         * @param {Mrr.MrShaderUniform} message MrShaderUniform
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MrShaderUniform.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.uniformName = "";
                object.count = 0;
                object.type = options.enums === String ? "SCALAR" : 0;
            }
            if (message.uniformName != null && message.hasOwnProperty("uniformName"))
                object.uniformName = message.uniformName;
            if (message.count != null && message.hasOwnProperty("count"))
                object.count = message.count;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.Mrr.MrUniformType[message.type] === undefined ? message.type : $root.Mrr.MrUniformType[message.type] : message.type;
            return object;
        };

        /**
         * Converts this MrShaderUniform to JSON.
         * @function toJSON
         * @memberof Mrr.MrShaderUniform
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MrShaderUniform.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MrShaderUniform
         * @function getTypeUrl
         * @memberof Mrr.MrShaderUniform
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MrShaderUniform.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/Mrr.MrShaderUniform";
        };

        return MrShaderUniform;
    })();

    /**
     * MrUniformType enum.
     * @name Mrr.MrUniformType
     * @enum {number}
     * @property {number} SCALAR=0 SCALAR value
     * @property {number} VEC2=1 VEC2 value
     * @property {number} VEC3=2 VEC3 value
     * @property {number} VEC4=3 VEC4 value
     * @property {number} MAT2=4 MAT2 value
     * @property {number} MAT3=5 MAT3 value
     * @property {number} MAT4=6 MAT4 value
     */
    Mrr.MrUniformType = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "SCALAR"] = 0;
        values[valuesById[1] = "VEC2"] = 1;
        values[valuesById[2] = "VEC3"] = 2;
        values[valuesById[3] = "VEC4"] = 3;
        values[valuesById[4] = "MAT2"] = 4;
        values[valuesById[5] = "MAT3"] = 5;
        values[valuesById[6] = "MAT4"] = 6;
        return values;
    })();

    return Mrr;
})();

export { $root as default };
