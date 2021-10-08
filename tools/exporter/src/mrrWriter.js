import {mrr} from "@mrrobotto/mrr";

function writeGroupNode(obj) {
    const group = mrr.Group.create({});
    return mrr.Node.create({
        name: obj.name,
        type: mrr.Node.Type.GROUP,
        group
    });
}

function writeAttribute(name, attr) {
    return mrr.Attribute.create({
        name,
        array: attr.array,
        size: attr.size,
        count: attr.count
    });
}

function writeMeshNode(obj) {
    const position = writeAttribute("position", obj.geometry.attributes.position);
    const normal = writeAttribute("normal", obj.geometry.attributes.normal);
    const uv = writeAttribute("uv", obj.geometry.attributes.uv);

    const attributes = new Map();
    attributes.set("position", position);
    attributes.set("normal", normal);
    attributes.set("uv", uv);

    // TODO: Review
    const mesh = mrr.Mesh.create({
        attributes,
        index: obj.index
    });

    return mrr.Node.create({
        name: obj.name,
        type: mrr.Node.Type.MESH,
        mesh
    });
}

function writeTree(obj) {
    let node;
    switch (obj.type) {
        case "Group":
            node = writeGroupNode(obj);
            break;
        case "Mesh":
            node = writeMeshNode(obj);
            break;
    }
    if (!node || !node.type) {
        return;
    }
    node.children = obj.children.map((child) => writeTree(child)).filter((child) => !!child);
    return node;
}

export function write(parsed) {
    const root = writeTree(parsed);
    const rootWriter = mrr.Node.encode(root);
    return rootWriter.finish();
}
