import {objParser} from "./src/formats/objParser"
import {jsonWrite} from "./src/writer/jsonWriter"
import {cborHexWrite, cborWrite} from "./src/writer/cborWriter"
import merge from "lodash/merge"

type ImportFormat = 'obj'
type ExportFormat = 'json' | 'cbor' | 'hex'

interface Options {
    importFormat: ImportFormat,
    exportFormat: ExportFormat
}

const DEFAULT_OPTIONS: Options = {
    importFormat: "obj",
    exportFormat: "hex"
}

export function mrrExport(fileContent: string, options: Options = DEFAULT_OPTIONS) {
    let parsed

    const mergedOptions = merge({}, DEFAULT_OPTIONS, options)
    const {importFormat, exportFormat} = mergedOptions

    switch (importFormat) {
        case "obj":
            parsed = objParser(fileContent)
            break
    }

    let result
    switch (exportFormat) {
        case "json":
            result = jsonWrite(parsed)
            break
        case "cbor":
            result = cborWrite(parsed)
            break
        case "hex":
            result = cborHexWrite(parsed)
            break
    }
    return result
}

export default mrrExport;
