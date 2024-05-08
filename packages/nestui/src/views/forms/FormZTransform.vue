<template>
    <div class="flex">
        <FormVector class="w-1/3" vec3 v-model="modelValue.location" label="Location"/>

        <FormVector class="w-1/3" quat v-model="modelValue.rotation" label="Rotation"/>

        <FormVector class="w-1/3" vec3 v-model="modelValue.scale" label="Scale" />
    </div>

</template>

<script setup lang="ts">
import {ZTransform} from "@zernikalos/zkbuilder"
import {useVModel} from "@vueuse/core";
import FormVector from "./FormVector.vue";

const props = defineProps<{
    modelValue: ZTransform
}>()

const emit = defineEmits(["update:modelValue"])
const data = useVModel(props, 'modelValue', emit)

</script>

<style scoped>

</style>
