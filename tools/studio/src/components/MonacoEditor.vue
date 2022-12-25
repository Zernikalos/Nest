<template>
    <div ref="refEditor" class="w-1"></div>
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor'
import {editor} from "monaco-editor";
import {onMounted, ref, watch} from "vue"

const refEditor = ref()
let editor: editor.IStandaloneCodeEditor

interface Props {
    editorText: string,
    format?: 'json' | undefined
}

const props = withDefaults(defineProps<Props>(), {
    editorText: "", format: undefined
})

watch(() => props.editorText, (newValue) => {
    editor?.setValue(newValue)
})

onMounted(() => {
    editor = monaco.editor.create(refEditor.value, {
        value: props.editorText,
        language: props?.format ?? undefined,
        theme: 'vs-dark',
        automaticLayout: true
    })

    window.onresize = () => editor.layout()
})

</script>

<style scoped>

</style>
