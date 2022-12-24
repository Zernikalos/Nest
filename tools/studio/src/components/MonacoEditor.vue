<template>
    <div ref="refEditor"></div>
</template>

<script setup>
import * as monaco from 'monaco-editor'
import {onMounted, ref, watch} from "vue"

const refEditor = ref()
let editor

const props = defineProps({
    editorText: String
})

watch(() => props.editorText, (newValue) => {
    editor?.setValue(newValue)
})

onMounted(() => {
    editor = monaco.editor.create(refEditor.value, {
        value: props.editorText,
        // language: 'javascript',
        theme: 'vs-dark'
    })
})

</script>

<style scoped>

</style>
