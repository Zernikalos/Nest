<template>
    <div class="flex flex-col">
        <FileLoader v-model:file-content="editorText"></FileLoader>
        <div class="flex h-full space-x-5">
            <MonacoEditor class="grow w-1/2" v-model:editor-text="editorText"></MonacoEditor>
            <MonacoEditor class="grow w-1/2" v-model:editor-text="editorText"></MonacoEditor>
        </div>
    </div>
</template>

<script setup>
import MonacoEditor from "@studio/components/MonacoEditor.vue";
import FileLoader from "@studio/components/FileLoader.vue";
import {ref} from "vue";

const editorText = ref()

</script>

<style scoped>
</style>
