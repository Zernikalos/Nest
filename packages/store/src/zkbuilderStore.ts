import {defineStore} from "pinia"
import {
    DEFAULT_PARSE_OPTIONS,
    ExportOptions,
    LoadOptions,
    ParseOptions,
    zkExport,
    zkImport,
    zkLoad, ZkoFile, ZkoParsed,
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

    async function exportAs(zkoParsed: ZkoParsed, exportOptions: ExportOptions) {
        if (_.isNil(zkoParsed)) {
            return ""
        }
        return await zkExport(zkoParsed, exportOptions)
    }

    async function exportAsProtoString(zkoParsed: ZkoParsed): Promise<string> {
        if (_.isNil(zkoParsed)) {
            return ""
        }
        return await zkExport(zkoParsed, {
            beauty: true,
            format: "proto",
            stringify: true
        }) as string
    }

    async function exportAsProtoBuffer(zkoParsed: ZkoParsed): Promise<Uint8Array | undefined> {
        if (_.isNil(zkoParsed)) {
            return
        }
        return await zkExport(zkoParsed, {
            format: "proto",
            stringify: false
        }) as Uint8Array
    }

    async function exportAsJsonString(zkoParsed: ZkoParsed): Promise<string> {
        if (_.isNil(zkoParsed)) {
            return ""
        }
        return await zkExport(zkoParsed, {
            beauty: true,
            format: "json",
            stringify: true
        }) as string
    }

    async function exportAsObject(zkoParsed: ZkoParsed): Promise<ZkoFile> {
        if (_.isNil(zkoParsed)) {
            return ""
        }
        return await zkExport(zkoParsed, {
            format: "object"
        })
    }

    function importZko(fileData: Int8Array): ZObject {
        return zkImport({data: fileData})
    }

    return {parseFile, exportAs, exportAsProtoString, exportAsJsonString, exportAsObject, exportAsProtoBuffer, importZko}
})
