import {computed, Ref, ref} from "vue"
import _ from "lodash"
import {defineStore} from "pinia"

export interface TabModel {
    title: string
    id: string
    isActive?: boolean
}

export const useTabStore = defineStore('tabStore', () => {

    const tabList: Ref<TabModel[]> = ref([])
    const tabMap: Ref<Map<string|number, TabModel>> = computed(() => new Map(tabList.value.map(t => [t.id, t])))

    function addTab(tab: TabModel) {
        if (tabMap.value.has(tab.id)) {
            selectTab(tab)
            return
        }
        tabList.value.push(tab)
        if (tabList.value.length === 1) {
            selectTab(tab)
        }
    }

    function addTabs(tabs: TabModel[]) {
        tabs.forEach(tab => addTab(tab))
    }

    function removeTab(tab: TabModel) {
        tabList.value = tabList.value.filter(t => t.id !== tab.id)
        if (tab.isActive && tabList.value.length > 0) {
            selectTab(tabList.value[tabList.value.length - 1])
        }
    }

    function selectTabById(tabId: string | number) {
        const selectedTab = tabMap.value.get(tabId)
        if (_.isNil(selectedTab)) {
            return
        }

        tabList.value.forEach(tab => tab.isActive = false)
        selectedTab.isActive = true
    }

    function hasTab(tabId: string | number): boolean {
        return tabMap.value.has(tabId)
    }

    function selectTab(tab: TabModel) {
        selectTabById(tab.id)
    }

    return {
        tabMap,
        tabList,
        hasTab,
        addTabs,
        removeTab,
        selectTab,
        selectTabById
    }
})