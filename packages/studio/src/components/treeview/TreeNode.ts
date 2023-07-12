import _, {isNil} from "lodash"
import {computed, reactive} from "vue"

export interface TreeNode {
    id: string
    label: string;
    icon?: string;
    children: TreeNode[]
}

export interface TreeNodeView extends TreeNode {
    parent: TreeNodeView | null
    isSelected?: boolean
    children: TreeNodeView[]
    isOpen: boolean
    visible: boolean
    level: number
}

export function useTreeViewState() {

    let root: TreeNodeView | null = null

    const labelMap: Map<string, TreeNodeView> = new Map()
    const selected: TreeNodeView[] = []
    const treeList: TreeNodeView[] = []

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
        const rtv = reactive(tv)

        treeList.push(rtv)

        if (_.isNil(node.children) || _.isEmpty(node.children)) {
            labelMap.set(rtv.label, rtv)
            return rtv
        }

        rtv.children = node.children.map((child) => innerConvertToTreeView(child, rtv))
        labelMap.set(rtv.label, rtv)
        return rtv
    }

    function convertToTreeView(node: TreeNode) {
        root = innerConvertToTreeView(node, null)
        return root
    }

    function findByLabel(label: string): TreeNodeView | undefined {
        return labelMap.get(label)
    }

    function select(node: TreeNodeView) {
        if (_.isNil(node)) {
            return
        }
        selected.forEach((s) => s.isSelected = false)
        selected.splice(0)
        node.isSelected = true
        selected.push(node)
    }

    function selectPrevVisible(node: TreeNodeView) {
        const idx = _.findIndex(visibleList.value, (e) => e.id === node.id)
        if (idx === 0) {
            return
        }
        const nextNode = visibleList.value[idx - 1]
        select(nextNode)
    }

    function selectNextVisible(node: TreeNodeView) {
        const idx = _.findIndex(visibleList.value, (e) => e.id === node.id)
        if (idx === visibleList.value.length - 1) {
            return
        }
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
        const found = _.find(treeList, (e) => e.id === node.id)
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
        const found = _.find(treeList, (e) => e.id === node.id)
        if (_.isNil(found)){
            return
        }
        found.isOpen = false
        found.visible = true
        closeRecursive(found)
    }

    const visibleList = computed(() => treeList.filter(e => e.visible))
    const openList = computed(() => treeList.filter(e => e.isOpen))
    const lastSelected = computed(() => _.last(selected))

    return {root, convertToTreeView, findByLabel, select, selectNextVisible, selectPrevVisible, open, close, visibleList, openList, treeList, lastSelected}
}
