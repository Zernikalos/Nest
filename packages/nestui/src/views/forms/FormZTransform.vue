<template>
    <div class="row">
        <FormVector class="col-4" vec3 :model-value="modelValue.location" @update:model-value="(ev) => handleUpdate('location', ev)" label="Location"/>

        <FormVector class="col-4" quat :model-value="modelValue.rotation" @update:model-value="(ev) => handleUpdate('rotation', ev)" label="Rotation"/>

        <FormVector class="col-4" vec3 :model-value="modelValue.scale" @update:model-value="(ev) => handleUpdate('scale', ev)" label="Scale" />
    </div>

</template>

<script setup lang="ts">
import FormVector from "components/forms/FormVector.vue"
import {ZTransform} from "@zernikalos/zkbuilder"
import _ from "lodash"

const props = defineProps<{
    modelValue: ZTransform
}>()

const emit = defineEmits(["update:modelValue"])

function handleUpdate(key, ev) {
    const cpy = _.merge({}, props.modelValue, {[key]: ev})
    emit("update:modelValue", cpy)
}

</script>

<style scoped>

</style>
