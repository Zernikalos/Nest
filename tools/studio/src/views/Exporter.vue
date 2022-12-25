<template>
    <div class="flex flex-col">
        <div class="flex">
            <FileLoader class="w-1/2" v-model:file-content="inputText"></FileLoader>
            <OutputFormatSelector class="w-1/2"></OutputFormatSelector>
        </div>
        <div class="flex h-full space-x-5">
            <MonacoEditor class="grow w-1/2" v-model:editor-text="inputText"></MonacoEditor>
            <MonacoEditor class="grow w-1/2" v-model:editor-text="parseResult" format="json"></MonacoEditor>
        </div>
    </div>
</template>

<script setup>
import MonacoEditor from "@studio/components/MonacoEditor.vue"
import FileLoader from "@studio/components/FileLoader.vue"
import useParseToMrr from "@studio/hooks/useParseToMrr"
import {computed, ref} from "vue"
import OutputFormatSelector from "@studio/components/OutputFormatSelector.vue";

const inputText = ref()

const parseResult = computed(() => {
    if (!inputText.value || inputText.value === "") {
        return ""
    }
    return useParseToMrr(inputText.value)
})


</script>

<style scoped>
</style>
