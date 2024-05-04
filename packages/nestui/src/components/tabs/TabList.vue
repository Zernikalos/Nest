<template>
    <div class="flex overflow-x-scroll">
        <div role="tablist" class="tabs tabs-lifted">
            <Tab v-for="tab in tabStore.tabList.value" v-bind="tab" @close="handleCloseTab(tab)" @select="handleSelectTab(tab)"></Tab>
        </div>
        <span class="grow border-b border-base-300"></span>
    </div>
</template>

<script setup lang="ts">
import Tab from "@nestui/components/tabs/Tab.vue"
import {TabModel} from "./TabModel"
import {useVModel} from "@vueuse/core";
import {useTabStore} from "@nestui/components/tabs/TabStore";
import {watch} from "vue";

const tabStore = useTabStore()

const props = defineProps<{tabs: TabModel[]}>()
const emit = defineEmits(['update:tabs', 'select'])
const data = useVModel(props, 'tabs', emit)

watch(() => props.tabs.length, (newValue) => {
    tabStore.addTabs(props.tabs)
})

watch(tabStore.tabList, (newValue) => {
    data.value.splice(0)
    data.value.push(...newValue)
})

tabStore.addTabs(data.value)

function handleCloseTab(tab: TabModel) {
    tabStore.removeTab(tab)
}

function handleSelectTab(tab: TabModel) {
    tabStore.selectTab(tab)
    emit('select', tab)
}

</script>

<style scoped lang="postcss">

</style>