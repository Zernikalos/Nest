<template>
    <div class="column" v-if="studioStore.obj">
        <div class="row">
            <div class="col-3">
                <q-input v-model="studioStore.obj.name" label="Name" />
            </div>
            <div class="col-3 self-end">
                <q-input v-model="studioStore.obj.id" disable label="ID" />
            </div>
        </div>
        <q-expansion-item
            switch-toggle-side
            expand-separator
            label="Transform"
        >
            <FormZTransform v-model="studioStore.obj.transform"></FormZTransform>
        </q-expansion-item>
        <q-expansion-item
            switch-toggle-side
            expand-separator
            v-if="studioStore.obj.type === 'Model'"
            label="Shading"
        >
            <FormZShaderProgram></FormZShaderProgram>
        </q-expansion-item>
    </div>
</template>

<script setup lang="ts">
import FormZTransform from "components/forms/FormZTransform.vue"
import {useStudioStore} from "stores/studio-store"
import FormZShaderProgram from "components/forms/FormZShaderProgram.vue"

const studioStore = useStudioStore()

</script>

<style scoped>

</style>
