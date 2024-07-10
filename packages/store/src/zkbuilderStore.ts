import {defineStore} from "pinia"
import {
    DEFAULT_PARSE_OPTIONS,
    ExportOptions,
    LoadOptions,
    ParseOptions,
    ProtoZkObject,
    zkExport,
    zkImport,
    zkLoad,
    zkParse,
    ZObject
} from "@zernikalos/zkbuilder"
import _ from "lodash"

export const useZkBuilderStore = defineStore("zkbuilder", () => {
    async function parseFile(loadOptions: LoadOptions, parseOptions: ParseOptions = DEFAULT_PARSE_OPTIONS) {
        const mergedLoadOptions = _.merge({}, loadOptions)
        const mergedParseOptions = _.merge({}, parseOptions)

        const parseableObj = await zkLoad(mergedLoadOptions)
        return await zkParse(parseableObj, mergedParseOptions)
    }

    async function exportAs(obj: ZObject, exportOptions: ExportOptions) {
        if (_.isNil(obj)) {
            return ""
        }
        return await zkExport(obj, exportOptions)
    }

    async function exportAsProtoString(obj: ZObject): Promise<string> {
        if (_.isNil(obj)) {
            return ""
        }
        return await zkExport(obj, {
            beauty: true,
            format: "proto",
            stringify: true
        }) as string
    }

    async function exportAsProtoBuffer(obj: ZObject): Promise<Uint8Array | undefined> {
        if (_.isNil(obj)) {
            return
        }
        return await zkExport(obj, {
            format: "proto",
            stringify: false
        }) as Uint8Array
    }

    async function exportAsJsonString(obj: ZObject): Promise<string> {
        if (_.isNil(obj)) {
            return ""
        }
        return await zkExport(obj, {
            beauty: true,
            format: "json",
            stringify: true
        }) as string
    }

    async function exportAsObject(obj: ZObject): Promise<ProtoZkObject> {
        if (_.isNil(obj)) {
            return ""
        }
        return await zkExport(obj, {
            format: "object"
        })
    }

    function importZko(fileData: Uint8Array): ZObject {
        return zkImport({data: fileData})
    }

    return {parseFile, exportAs, exportAsProtoString, exportAsJsonString, exportAsObject, exportAsProtoBuffer, importZko}
})
