<template>
    <input type="file" id="file" ref="inputFile" v-on:change="handleUploadFile"/>
</template>

<script setup>
const emit = defineEmits(["file-upload"])

const handleUploadFile = async (ev) => {
    ev.preventDefault()
    const file = ev.target.files[0]
    emit("file-upload", {file})
}

defineExpose({
    handleUploadFile
})
</script>

<style scoped>

</style>
