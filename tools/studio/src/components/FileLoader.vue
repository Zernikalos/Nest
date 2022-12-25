<template>
    <input type="file" id="file"
           class=""
           @change="handleUploadFile" />
</template>

<script setup>
import {defineEmits} from "vue"
import useReadFile from "@studio/hooks/useReadFile"

const emit = defineEmits(['update:fileContent'])

async function handleUploadFile(ev) {
    ev.preventDefault()
    const file = ev.target?.files.length > 0 ? ev.target?.files[0] : undefined
    if (file === undefined) {
        return
    }
    const fileContent = await useReadFile(file)
    emit('update:fileContent', fileContent)
}
</script>

<style scoped>

</style>
