<template>
    <div v-if="!hasItems && !projectStore.hasDefinedProject">
        <NewProject />
    </div>
    <EditorView v-else />
</template>

<script setup lang="ts">
import { useProjectStore } from '../store/projectStore'
import NewProject from '../views/NewProject.vue'
import { useExplorerStore } from '@nestui/store'
import EditorView from '@nestui/views/EditorView.vue'
import { storeToRefs } from 'pinia'

const explorerStore = useExplorerStore()
const { hasItems } = storeToRefs(explorerStore)
const projectStore = useProjectStore()

</script>

<style scoped>

</style>
