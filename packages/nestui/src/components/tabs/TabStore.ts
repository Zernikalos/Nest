import {computed, Ref, ref} from "vue"
import {TabModel} from "./TabModel"
import _ from "lodash"

export function useTabStore() {

    const tabSet: Ref<Map<string|number, TabModel>> = ref(new Map())

    const tabList = computed(() => [...tabSet.value.values()])

    function addTab(tab: TabModel) {
        if (tabSet.value.has(tab.id)) {
            //selectTab(tab)
            return
        }
        tabSet.value.set(tab.id, tab)
        if (tabSet.value.size === 1) {
            selectTab(tab)
        }
    }

    function addTabs(tabs: TabModel[]) {
        tabs.forEach(tab => addTab(tab))
    }

    function removeTab(tab: TabModel) {
        tabSet.value.delete(tab.id)
    }

    function selectTabById(tabId: string | number) {
        const selectedTab = tabSet.value.get(tabId)
        if (_.isNil(selectedTab)) {
            return
        }
        tabList.value.forEach(tab => tab.isActive = false)
        selectedTab.isActive = true
    }

    function selectTab(tab: TabModel) {
        selectTabById(tab.id)
    }

    return {
        tabSet,
        tabList,
        addTab,
        addTabs,
        removeTab,
        selectTab,
        selectTabById
    }
}