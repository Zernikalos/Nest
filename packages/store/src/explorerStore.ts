import {defineStore} from "pinia";
import {ref} from "vue";
import {ZObject} from "@zernikalos/zkbuilder";
import _, {isNil} from "lodash";
import {findById} from "@zernikalos/zkbuilder";
import {useNestStore} from "./nestStore";

interface ExplorerItem {
    id: string
    label: string
    icon: string
    children: ExplorerItem[]
}

const typesIcons: {[key: string]: string} = {
    "SCENE": "bi-map", //bi-aspect-ratio
    "GROUP": "bi-layout-wtf",
    "MODEL": "bi-box",
    "BONE": "bi-bezier2",
    "SKELETON": "bi-person-arms-up"
}

function convertToHierarchy(obj: ZObject) {
    if (!obj) {
        return undefined
    }
    const convertToHierarchyRecursive = (obj: ZObject): ExplorerItem => {
        const res: ExplorerItem = {
            id: obj.id,
            label: obj.name,
            icon: typesIcons[obj.type.name],
            children: []
        }
        res.children = obj.children.map((c) => convertToHierarchyRecursive(c))
        return res
    }
    return convertToHierarchyRecursive(obj)
}

export const useExplorerStore = defineStore("explorerStore", () => {
    const explorerItems = ref<ExplorerItem[]>([])
    const nestStore = useNestStore()
    const selected = ref<ZObject>()

    function select(newSelected: ZObject | undefined) {
        selected.value = newSelected
    }

    function load() {
        if (isNil(nestStore.root)) {
            return;
        }
        const transformed = convertToHierarchy(nestStore.root as ZObject)
        explorerItems.value.splice(0)
        if (_.isNil(transformed)) {
            return
        }
        explorerItems.value.push(transformed)
    }

    function selectById(id: string) {
        if (_.isNil(nestStore.root)) {
            return
        }
        const newSelect = findById(nestStore.root as ZObject, id)
        select(newSelect)
    }

    function updateSelected(jsonStr: string) {
        try {
            const newData = JSON.parse(jsonStr)
            _.merge(selected.value, newData)
        } catch (_e) {

        }
    }

    return {selected, explorerItems, load, select, selectById, updateSelected}
})