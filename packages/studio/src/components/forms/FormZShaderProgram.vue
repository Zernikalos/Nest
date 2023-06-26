<template>
    <div class="column">
        <div class="row" style="height: 300px;">
            <div class="col">
                Vertex Shader
                <MonacoEditor class="shader-box" language="glsl" v-model="shaderProgram.vertexShader.source"></MonacoEditor>
            </div>
            <div class="col">
                Fragment Shader
                <MonacoEditor class="shader-box" language="glsl" v-model="shaderProgram.fragmentShader.source"></MonacoEditor>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import {useStudioStore} from "stores/studio-store"
import {computed} from "vue"
import {ZModel} from "@zernikalos/zkbuilder"
import MonacoEditor from "components/monacoeditor/MonacoEditor.vue"
import _ from "lodash"

const studioStore = useStudioStore()

const shaderProgram = computed(() => {
    const shader = (studioStore.obj as ZModel).shaderProgram
    if (_.isNil(shader)) {
        return {vertexShader: {source: ""}, fragmentShader: {source: ""}}
    }
    return shader
})

</script>

<style scoped>
.shader-box {
    height: 500px;
}

</style>
