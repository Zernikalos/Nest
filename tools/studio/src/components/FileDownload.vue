<template>
    <a
        :href="fileDownload.href"
        :download="fileDownload.name">
            DOWNLOAD {{fileDownload ? props.file.length : "undef"}}
    </a>
</template>

<script setup>
import {reactive, watch} from "vue"

const createDownload = (name, blob) => {
    const anchorElement = document.createElement("a");
    anchorElement.href = URL.createObjectURL(blob);
    anchorElement.download = "cube.mrr";
    anchorElement.click();
    URL.revokeObjectURL(anchorElement.href);
}

const fileDownload = reactive({
    href: undefined,
    name: undefined
})

const props = defineProps({
    file: {blob: Blob, name: String}
})

// const downloadUrl = ref(null)

watch(props.file, (file, prevFile) => {
    console.log(file)
    createDownload(file.name, file.blob)
})

</script>

<style scoped>

</style>
