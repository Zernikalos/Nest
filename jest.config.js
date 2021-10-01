
const {defaults} = require("jest-config");
const { jsWithBabel: tsjPreset } = require("ts-jest/presets");


module.exports = {
    ...defaults,
    transform: {
        ...tsjPreset.transform,
    }
};
