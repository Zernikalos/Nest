<template>
    <q-page class="column">
        <div class="row">
            <q-btn color="primary" @click="handleBundleClick">
                Bundle scene
            </q-btn>
            <q-toggle
                v-model="binaryFormat"
                label="Binary format"
            />
        </div>

        <div class="row col">
            <MonacoEditor :language="binaryFormat ? 'text' : 'json'" :editor-text="editorText" class="col-grow"></MonacoEditor>
        </div>
    </q-page>

</template>

<script setup lang="ts">
import MonacoEditor from "components/monacoeditor/MonacoEditor.vue"
import {ref} from "vue"
import {useStudioStore} from "stores/studio-store"

const binaryFormat = ref(true)
const editorText = ref("")
const studioStore = useStudioStore()

async function handleBundleClick() {
    if (binaryFormat.value) {
        editorText.value = await studioStore.exportRootAsProtoString()
    } else {
        editorText.value = await studioStore.exportRootAsJsonString()
    }
}
</script>

<style scoped>

</style>
