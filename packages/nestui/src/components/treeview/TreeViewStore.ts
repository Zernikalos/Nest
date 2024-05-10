import {computed, ref, Ref} from "vue";
import _, {isNil} from "lodash";
import {TreeNode} from "./TreeViewModel";

export interface TreeNodeView extends TreeNode {
    parent: TreeNodeView | null
    isSelected?: boolean
    children: TreeNodeView[]
    isOpen: boolean
    visible: boolean
    level: number
}

export function useTreeViewStore() {

    let root: Ref<TreeNodeView | undefined> = ref(undefined)

    const labelMap: Map<string, TreeNodeView> = new Map()
    const selected: Ref<TreeNodeView[]> = ref([])
    const treeList: Ref<TreeNodeView[]> = ref([])

    function innerConvertToTreeView(node: TreeNode, parent: TreeNodeView | null): TreeNodeView {
        const tv: TreeNodeView = {
            ...node,
            visible: isNil(parent),
            isSelected: false,
            isOpen: false,
            children: [],
            parent,
            level: isNil(parent) ? 1 : parent.level + 1
        }

        treeList.value.push(tv)

        if (_.isNil(node.children) || _.isEmpty(node.children)) {
            labelMap.set(tv.label, tv)
            return tv
        }

        tv.children = node.children.map((child) => innerConvertToTreeView(child, tv))
        labelMap.set(tv.label, tv)
        return tv
    }

    function convertRootToTreeView(node: TreeNode | undefined) {
        if (_.isNil(node)) {
            return
        }
        root.value = innerConvertToTreeView(node, null)
        return root
    }

    function findByLabel(label: string): TreeNodeView | undefined {
        return labelMap.get(label)
    }

    function findVisibleNodeIndexById(node: TreeNodeView) {
        return _.findIndex(visibleList.value, (e) => e.id === node.id)
    }

    function select(node: TreeNodeView) {
        if (_.isNil(node)) {
            return
        }
        const selectedNode = treeList.value.find((tv: TreeNodeView) => tv.id === node.id)
        if (_.isNil(selectedNode)) {
            return;
        }
        selected.value.forEach((s) => s.isSelected = false)
        selected.value.splice(0)
        selectedNode.isSelected = true
        selected.value.push(selectedNode)
    }

    function selectPrevVisible(node: TreeNodeView) {
        const idx = findVisibleNodeIndexById(node)
        const nextNode = visibleList.value[idx - 1]
        select(nextNode)
    }

    function selectNextVisible(node: TreeNodeView) {
        const idx = findVisibleNodeIndexById(node)
        const nextNode = visibleList.value[idx + 1]
        select(nextNode)
    }

    function openRecursive(node: TreeNodeView) {
        for (const child of node.children) {
            child.visible = true
            if (child.isOpen) {
                openRecursive(child)
            }
        }
    }

    function open(node: TreeNodeView) {
        const found = _.find(treeList.value, (e) => e.id === node.id)
        if (_.isNil(found)){
            return
        }
        found.isOpen = true
        found.visible = true

        openRecursive(found)
    }

    function closeRecursive(node: TreeNodeView) {
        for (const child of node.children) {
            if (child.visible) {
                child.visible = false
            }
            closeRecursive(child)
        }
    }

    function close(node: TreeNodeView) {
        const found = _.find(treeList.value, (e) => e.id === node.id)
        if (_.isNil(found)){
            return
        }
        found.isOpen = false
        found.visible = true
        closeRecursive(found)
    }

    const visibleList = computed(() => treeList.value.filter(e => e.visible))
    const openList = computed(() => treeList.value.filter(e => e.isOpen))
    const lastSelected = computed(() => _.last(selected.value))

    return {root, convertRootToTreeView, findByLabel, select, selectNextVisible, selectPrevVisible, open, close, visibleList, openList, treeList, selected, lastSelected}
}
