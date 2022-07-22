function parseMesh(meshThreeObj) {
    const geometry = parseGeometry(meshThreeObj.geometry);
    return {geometry};
}

function parseGeometry(geometryThree) {
    const attributesThree = geometryThree.attributes;
    const index = geometryThree.index;
    const attributes = {};
    const attrNames = ['position', 'normal', 'uv'];
    for (let name of attrNames) {
        const attrThree = attributesThree[name];
        attributes[name] = parseAttributes(attrThree)
    }

    return {attributes, index};
}

function parseAttributes(attribThree) {
    if (!attribThree) {
        return {
            array: [],
            count: 0,
            size: 0
        }
    }
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
