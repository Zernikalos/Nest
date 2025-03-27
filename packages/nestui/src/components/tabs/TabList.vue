<template>
    <div class="flex overflow-x-auto w-full">
        <div
            role="tablist"
            class="tabs tabs-lift"
        >
            <Tab
                v-for="tab in tabStore.tabList.value"
                :key="tab.id"
                v-bind="tab"
                @close="handleCloseTab(tab)"
                @select="handleSelectTab(tab)"
            />
        </div>
        <span class="grow border-b border-base-300" />
    </div>
</template>

<script setup lang="ts">
import Tab from "@nestui/components/tabs/Tab.vue"
import {TabModel} from "./TabModel"
import {useVModel} from "@vueuse/core"
import {useTabStore} from "@nestui/components/tabs/TabStore"
import {watch} from "vue"

const tabStore = useTabStore()

const props = defineProps<{
    tabs: TabModel[],
    selected?: string | number
}>()
const emit = defineEmits(["update:tabs", "select"])
const openTabs = useVModel(props, "tabs", emit)

watch(() => props.tabs, (newTabs) => {
    const tabsToAdd = newTabs
        .filter(tab => !tabStore.hasTab(tab.id))
    tabStore.addTabs(tabsToAdd)
}, {deep: true})

watch(() => props.selected, (newValue) => {
    tabStore.selectTabById(newValue)
})

watch(tabStore.tabList, (currentTabs) => {
    openTabs.value = [...currentTabs]
})

tabStore.addTabs(props.tabs)

function handleCloseTab(tab: TabModel) {
    tabStore.removeTab(tab)
}

function handleSelectTab(tab: TabModel) {
    tabStore.selectTab(tab)
    emit("select", tab)
}

</script>

<style scoped>

</style>