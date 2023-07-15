<template>
    <div ref="refEditor"></div>
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor"
import {editor} from "monaco-editor"
import {computed, onMounted, ref, watch} from "vue"
import {monacoGlslConf, monacoGlslLanguage} from "./glsl.language";
// import {useElementSize} from "@vueuse/core";

const refEditor = ref()
let editor: editor.IStandaloneCodeEditor

interface Props {
    modelValue: string
    language?: "json" | "text" | "glsl"
    width?: number
    height?: number
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: "",
    language: "text"
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
    const model = monaco.editor.createModel(editor?.getValue() ?? "", toMonacoLanguage(newValue))
    editor?.setModel(model)
})

setUpGlsl()

onMounted(() => {
    editor = monaco.editor.create(refEditor.value, {
        value: props.modelValue,
        language: monacoLanguage.value,
        theme: "vs-dark",
        automaticLayout: true,
        wordWrap: "on"
    })

    editor.layout()
    window.onresize = () => editor.layout()
    editor.onDidChangeModelContent(function(_e) {
        emit("update:modelValue", editor.getValue())
    })

    // const { width, height } = useElementSize(refEditor)

    //setInterval(() => console.log(propo.value), 1000)
    // watch([width, height], ([newWidth, newHeight]) => {
    //
    //     editor.layout({width: Math.floor(newWidth), height: Math.floor(newHeight)})
    //     console.log(`${newWidth}x${newHeight}`)
    // })
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
