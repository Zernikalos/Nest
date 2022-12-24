<template>
    <div>
        <FileLoader v-model:file-content="editorText"></FileLoader>
        <div class="flex flex-row">
            <MonacoEditor class="h-screen w-1/2" v-model:editor-text="editorText"></MonacoEditor>
            <span class="pl-2 pr-2"></span>
            <MonacoEditor class="h-screen w-1/2" v-model:editor-text="editorText"></MonacoEditor>
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
