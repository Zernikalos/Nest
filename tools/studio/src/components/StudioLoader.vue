<template>
    <div>
        <SingleFileInput v-on:file-upload="handleFileUpload" />
        <FileDownload ref="fileDownload" v-bind:file="mrrFile"/>
    </div>
</template>

<script setup>
import {reactive} from "vue"

import {parseObj} from "@mrrobotto/exporter"

import SingleFileInput from "./SingleFileInput.vue"
import FileDownload from "./FileDownload.vue"

const mrrFile = reactive({})

const handleFileUpload = async (ev) => {
    const f = ev.file
    const content = await f.arrayBuffer()
    const decoder = new TextDecoder()
    const fileContent = decoder.decode(content)
    const obj3d = parseObj(fileContent)

    const blob = new Blob([obj3d.mrr], {type: "application/mrr"})
    mrrFile.name = f.name
    mrrFile.blob = blob
    return obj3d
}

defineExpose({
    handleFileUpload
})
</script>

<style scoped>
</style>
