<template>
    <input class="input inputfile" id="file_input" type="file" @change="handleUploadFile">
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
.input {
    @apply block w-full text-sm border cursor-pointer text-gray-400 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400
}
.inputfile {
    @apply file:text-sm file:border-0 file:border-r-2 cursor-pointer file:text-gray-400 file:bg-gray-700 hover:file:bg-gray-900
}

</style>
