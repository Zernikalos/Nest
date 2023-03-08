<template>
    <div ref="refEditor" class="w-1"></div>
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor'
import {editor} from "monaco-editor";
import {computed, onMounted, ref, watch} from "vue"
import {monacoGlslConf, monacoGlslLanguage} from "./glsl.language";

const refEditor = ref()
let editor: editor.IStandaloneCodeEditor

interface Props {
    editorText: string,
    language?: 'json' | 'text'
}

const props = withDefaults(defineProps<Props>(), {
    editorText: "",
    language: "text"
})

const monacoLanguage = computed(() => {
    return toMonacoLanguage(props.language)
})

watch(() => props.editorText, (newValue) => {
    editor?.setValue(newValue)
})

watch(() => props.language, (newValue) => {
    const model = monaco.editor.createModel(editor?.getValue() ?? "", toMonacoLanguage(newValue))
    editor?.setModel(model)
})

setUpGlsl()

onMounted(() => {
    editor = monaco.editor.create(refEditor.value, {
        value: props.editorText,
        language: monacoLanguage.value,
        theme: 'vs-dark',
        automaticLayout: true,
        wordWrap: "on",
    })

    window.onresize = () => editor.layout()
})

function setUpGlsl() {
    monaco.languages.register({id: 'glsl'})
    monaco.languages.setMonarchTokensProvider('glsl', monacoGlslLanguage)
    monaco.languages.setLanguageConfiguration('glsl', monacoGlslConf)
}

function toMonacoLanguage(language: string) {
    if (language === "text") {
        return undefined
    }
    return language
}

</script>

<style scoped>

</style>
