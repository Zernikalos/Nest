<template>
    <div class="join join-horizontal">
        <FileSelector class="join-item" @update:file-selected="handleFileSelectedEvent"></FileSelector>
        <DropDownSelector class="join-item" :options="labelOptions" :selected="props.formatSelected" @update:selected="(ev) => $emit('update:formatSelected', ev)"></DropDownSelector>
    </div>
</template>

<script setup lang="ts">
import FileSelector from "@studio/components/fileselector/FileSelector.vue"
import DropDownSelector from "@studio/components/dropdownselector/DropDownSelector.vue"
import {defaultFileExtensionMatcher, FileFormats} from "./defaultFileExtensionMatcher";
import {computed} from "vue";

const emit = defineEmits(['update:fileSelected', 'update:formatSelected'])

const props = withDefaults(defineProps<{
    formats: FileFormats[],
    formatSelected: string,
    matcher?: (formats: FileFormats[], fileName: string) => number
}>(), {
    matcher: defaultFileExtensionMatcher
})

const labelOptions = computed(() => props.formats.map(e => e.label))

function handleFileSelectedEvent(ev: { name: string, path: string }) {
    const name = ev.name
    const idx = defaultFileExtensionMatcher(props.formats, name)
    if (idx < 0) {
        emit('update:fileSelected', ev)
        return
    }
    emit('update:formatSelected', props.formats[idx].label)
    emit('update:fileSelected', ev)
}

</script>

<style scoped>

</style>
