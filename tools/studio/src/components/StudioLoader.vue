<template>
    <div>
        <input type="file" id="file" ref="file" v-on:change="handleFileUpload"/>
        <button @click="submitFile">Load file</button>
    </div>
</template>

<script>
import {parseObj} from "@mrrobotto/exporter"

const handleFileUpload = async (ev) => {
    const f = ev.target.files[0]
    const content = await f.arrayBuffer()
    const decoder = new TextDecoder()
    const fileContent = decoder.decode(content)
    const obj3d = parseObj(fileContent)
    debugger
    return obj3d
}

const submitFile = () => {
    console.log("submit")
}

export default {
    name: "StudioLoader",
    methods: {
        handleFileUpload,
        submitFile
    }
}
</script>

<style scoped>
</style>
