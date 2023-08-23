import {defineStore} from "pinia"
import {
    DEFAULT_PARSE_OPTIONS,
    ExportOptions,
    LoadOptions,
    ParseOptions,
    ProtoZObject,
    zkExport,
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

    async function exportAsObject(obj: ZObject): Promise<ProtoZObject> {
        if (_.isNil(obj)) {
            return ""
        }
        return await zkExport(obj, {
            format: "object"
        })
    }

    return {parseFile, exportAs, exportAsProtoString, exportAsJsonString, exportAsObject}
})
