<template>
    <div class="flex">
        <FormVector class="w-1/3" vec3 v-model="data.location" label="Location"/>
        <FormVector class="w-1/3" quat v-model="data.rotation" label="Rotation"/>
        <FormVector class="w-1/3" vec3 v-model="data.scale" label="Scale" />
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
