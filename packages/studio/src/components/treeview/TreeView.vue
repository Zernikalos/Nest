<template>
    <ul v-if="props.items.length > 0">
        <TreeViewItem :item="props.items[0]" />
    </ul>
</template>

<script setup lang="ts">
import {TreeData} from "./TreeData"
import TreeViewItem from "./TreeViewItem.vue"

const props = defineProps<{
    items: TreeData[]
}>()

</script>

<style scoped>

</style>
