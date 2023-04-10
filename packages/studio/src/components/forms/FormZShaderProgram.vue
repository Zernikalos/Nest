<template>
    <div class="column">
        <div class="row" style="height: 300px;">
            <div class="col">
                Vertex Shader
                <MonacoEditor class="shader-box" language="glsl" :editor-text="shaderProgram.vertexShader.source"></MonacoEditor>
            </div>
            <div class="col">
                Fragment Shader
                <MonacoEditor class="shader-box" language="glsl" :editor-text="shaderProgram.fragmentShader.source"></MonacoEditor>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import {useStudioStore} from "stores/studio-store"
import {computed} from "vue"
import {ZModel} from "@zernikalos/zkbuilder"
import MonacoEditor from "components/monacoeditor/MonacoEditor.vue"

const studioStore = useStudioStore()

const shaderProgram = computed(() => (studioStore.obj as ZModel).shaderProgram)

</script>

<style scoped>
.shader-box {
    height: 500px;
}

</style>
