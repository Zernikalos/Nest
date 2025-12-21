
import { omit, mapValues } from 'lodash';

const removeDataArrayRecursively = (obj: any): any => {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => removeDataArrayRecursively(item));
    }

    if (typeof obj === 'object') {
        // Remove dataArray field and recursively process remaining values
        const withoutDataArray = omit(obj, 'dataArray');
        const result = mapValues(withoutDataArray, value => removeDataArrayRecursively(value));
        return result;
    }

    return obj;
};

const createEditableCopy = (object: any) => {
    if (!object) {
        return null;
    }

    // First create deep copy with lodash, then remove all dataArray fields recursively
    const deepCopy = object.toJSON();
    return removeDataArrayRecursively(deepCopy);
};

export const sanitizeEditableObject = (zkResult: any, selectedZObject: any) => {
    if (!zkResult?.exported?.objects || !selectedZObject) {
        return null;
    }

    // Find the object with matching refId
    const matchingObject = zkResult.exported.objects.find((obj: any) => 
        obj.refId === selectedZObject.refId
    );

    if (!matchingObject) {
        return null;
    }

    // Return editable copy without dataArray
    return createEditableCopy(matchingObject);
};
