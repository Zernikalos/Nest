<template>
    <div v-if="!hasItems">
        <NewProject></NewProject>
    </div>
    <EditorView v-else></EditorView>
</template>

<script setup lang="ts">
import {useExplorerStore} from "@zernikalos/store"
import NewProject from "@nestui/views/NewProject.vue";
import EditorView from "@nestui/views/EditorView.vue";
import {storeToRefs} from "pinia";

const explorerStore = useExplorerStore()

const {hasItems} = storeToRefs(explorerStore)

</script>

<style scoped>

</style>
