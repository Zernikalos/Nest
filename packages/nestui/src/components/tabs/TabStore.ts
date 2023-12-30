import {computed, Ref, ref} from "vue";
import {TabModel} from "./TabModel";
import _ from "lodash";

export function useTabStore() {

    const tabSet: Ref<Map<string|number, TabModel>> = ref(new Map())

    const tabList = computed(() => [...tabSet.value.values()])

    function addTab(tab: TabModel) {
        if (tabSet.value.has(tab.id)) {
            selectTab(tab)
            return
        }
        tabSet.value.set(tab.id, tab)
    }

    function addTabs(tabs: TabModel[]) {
        tabs.forEach(tab => addTab(tab))
    }

    function removeTab(tab: TabModel) {
        tabSet.value.delete(tab.id)
    }

    function selectTab(tab: TabModel) {
        const selectedTab = tabSet.value.get(tab.id)
        if (_.isNil(selectedTab)) {
            return
        }
        // tabSet.value.forEach((tab) => tab.isActive = false)
        tabList.value.forEach(tab => tab.isActive = false)
        selectedTab.isActive = true
    }

    return {
        tabSet,
        tabList,
        addTab,
        addTabs,
        removeTab,
        selectTab
    }
}