<template>
    <div class="h-full w-full" ref="refEditor"></div>
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor"
import {editor as monacoEditor} from "monaco-editor"
import "./useWorker"
import {computed, onMounted, ref, watch} from "vue"
import {monacoGlslConf, monacoGlslLanguage} from "./glsl.language";

const refEditor = ref()
let editor: monacoEditor.IStandaloneCodeEditor

interface Props {
    modelValue: string
    language?: "json" | "text" | "glsl"
    theme?: "dark" | "light"
    width?: number
    height?: number
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: "",
    language: "text",
    theme: "dark"
})

const emit = defineEmits(["update:modelValue"])

const monacoLanguage = computed(() => {
    return toMonacoLanguage(props.language)
})

watch(() => props.modelValue, (newValue) => {
    if (newValue !== editor.getValue()) {
        editor?.setValue(newValue)
    }
})

watch(() => props.language, (newValue) => {
    const model = monacoEditor.createModel(editor?.getValue() ?? "", toMonacoLanguage(newValue))
    editor?.setModel(model)
})

setUpGlsl()

onMounted(() => {
    editor = monacoEditor.create(refEditor.value, {
        value: props.modelValue,
        language: monacoLanguage.value,
        theme: `vs-${props.theme}`,
        automaticLayout: true,
        wordWrap: "on",
        minimap: {enabled: false}
    })

    editor.onDidChangeModelContent(function(_e) {
        emit("update:modelValue", editor.getValue())
    })

})

function setUpGlsl() {
    monaco.languages.register({id: "glsl"})
    monaco.languages.setMonarchTokensProvider("glsl", monacoGlslLanguage)
    monaco.languages.setLanguageConfiguration("glsl", monacoGlslConf)
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
