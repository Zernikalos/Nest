<template>
    <div class="flex mx-auto">
        <FormVector
            v-model="data.location"
            vec3
            label="Location"
        />
        <FormVector
            v-model="data.rotation"
            quat
            label="Rotation"
        />
        <FormVector
            v-model="data.scale"
            vec3
            label="Scale"
        />
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
