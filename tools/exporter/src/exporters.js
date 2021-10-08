function parseMesh(meshThreeObj) {
    const geometry = parseGeometry(meshThreeObj.geometry);
    return {geometry};
}

function parseGeometry(geometryThree) {
    const attributesThree = geometryThree.attributes;
    const index = geometryThree.index;
    const positionThree = attributesThree.position;
    const normalThree = attributesThree.normal;
    const uvThree = attributesThree.uv;
    const attributes = {
        position: parseAttributes(positionThree),
        normal: parseAttributes(normalThree),
        uv: parseAttributes(uvThree)
    }
    return {attributes, index};
}

function parseAttributes(attribThree) {
    return {
        array: attribThree.array,
        count: attribThree.count,
        size: attribThree.itemSize
    }
}

function parseGroup(groupThreeObj) {
    return {visible: groupThreeObj.visible};
}

function parseCommon(threeNode) {
    return {name: threeNode.name, type: threeNode.type};
}

function parseNode(threeObj) {
    let parsed;
    switch (threeObj.type) {
        case "Mesh":
            parsed = parseMesh(threeObj);
            break;
        case "Group":
            parsed = parseGroup(threeObj);
            break;
    }
    const parsedNode = parseCommon(threeObj);
    return {...parsedNode, ...parsed};
}

export function exportThreeObj(threeObj) {
    const children = threeObj.children.map((child) => exportThreeObj(child));
    const parsed = parseNode(threeObj)
    return {...parsed, children};
}
