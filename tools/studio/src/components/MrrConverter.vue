<template>
    <input type="file" id="file" @change="handleUploadFile">
    <a
        v-if="mrrFile.name"
        :href="`${mrrFile.url}`"
        :download="mrrFile.name">
        DOWNLOAD {{ mrrFile.name }}
    </a>
</template>

<script setup>
import {reactive} from "vue"
import {merge} from "lodash";
import useMrrFile from "../hooks/useMrrFile"

const mrrFile = reactive({
    url: undefined,
    name: undefined,
    blob: undefined
})

async function handleUploadFile(ev) {
    ev.preventDefault()
    const file = ev.target?.files.length > 0 ? ev.target?.files[0] : undefined
    if (file === undefined) {
        return
    }
    merge(mrrFile, await useMrrFile(file))
}

</script>

<style scoped>

</style>
