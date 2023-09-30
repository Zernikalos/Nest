<template>
    <input class="file-input file-input-primary" id="file_input" type="file" @change="handleUploadFile">
</template>

<script setup>

const emit = defineEmits(['update:fileSelected'])

async function handleUploadFile(ev) {
    ev.preventDefault()
    const file = ev.target?.files.length > 0 ? ev.target?.files[0] : undefined
    if (file === undefined) {
        return
    }
    const fullPath = file.path ?? ''
    const fileName = file.name
    emit('update:fileSelected', {path: fullPath.replace(fileName, ""), name: fileName})
}
</script>

<style scoped>

</style>
