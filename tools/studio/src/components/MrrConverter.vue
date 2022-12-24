<template>
    <input type="file" id="file"
           class=""
           @change="handleUploadFile" />
    <a
        v-if="mrrFile.name"
        :href="`${mrrFile.url}`"
        :download="mrrFile.name">
        DOWNLOAD {{ mrrFile.name }}
    </a>

    <div>
        {{ mrrFile.hex }}
    </div>

    <textarea>{{mrrFile.data}}</textarea>

</template>

<script setup>
import {reactive} from "vue"
import {merge} from "lodash";
import useMrrExporter from "../hooks/useMrrExporter"

const mrrFile = reactive({
    url: undefined,
    name: undefined,
    blob: undefined,
    data: undefined
})

async function handleUploadFile(ev) {
    ev.preventDefault()
    const file = ev.target?.files.length > 0 ? ev.target?.files[0] : undefined
    if (file === undefined) {
        return
    }
    merge(mrrFile, await useMrrExporter(file))
}

</script>

<style scoped>

</style>
