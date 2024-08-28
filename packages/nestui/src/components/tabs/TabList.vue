<template>
    <div class="flex overflow-x-auto w-full">
        <div
            role="tablist"
            class="tabs tabs-lifted"
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
const data = useVModel(props, "tabs", emit)

watch(() => props.tabs.length, () => {
    tabStore.addTabs(props.tabs)
})

watch(() => props.selected, (newValue) => {
    tabStore.selectTabById(newValue)
})

watch(tabStore.tabList, (newValue) => {
    data.value.splice(0)
    data.value.push(...newValue)
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

<style scoped lang="postcss">

</style>