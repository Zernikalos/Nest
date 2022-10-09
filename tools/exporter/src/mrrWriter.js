import {Mrr} from "@mrrobotto/mrr";

function writeGroupNode(obj) {
    const group = Mrr.Group.create({});
    return Mrr.Node.create({
        name: obj.name,
        type: Mrr.Node.Type.GROUP,
        group
    });
}

function writeAttribute(name, attr) {
    return Mrr.Attribute.create({
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

    const attributes = {};
    attributes["position"] = position;
    attributes["normal"] = normal;
    attributes["uv"] = uv;

    // TODO: Review
    const mesh = Mrr.Mesh.create({
        attributes,
        index: obj.index
    });

    return Mrr.Node.create({
        name: obj.name,
        type: Mrr.Node.Type.MESH,
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

export function writeMrr(parsed) {
    const root = writeTree(parsed);
    const rootWriter = Mrr.Node.encode(root);
    return rootWriter.finish();
}
