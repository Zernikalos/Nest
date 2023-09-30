<template>
    <Modal id="import-modal" title="Import file" v-model:open="isOpen">
        <ImportFileView @finish="handleFinish"></ImportFileView>
    </Modal>
</template>

<script setup lang="ts">
import Modal from "@studio/components/Modal.vue"
import {onKeyStroke, useVModel} from "@vueuse/core"
import ImportFileView from "@studio/views/ImportFileView.vue"

const props = defineProps<{
    open: boolean
}>()

const emit = defineEmits(['update:open'])

const isOpen = useVModel(props, 'open', emit)

function closeModal() {
    isOpen.value = false
}

function handleFinish() {
    closeModal()
}

onKeyStroke(['Escape'], (e) => {
    e.preventDefault()
    closeModal()
})

</script>

<style scoped>

</style>