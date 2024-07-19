<template>
    <div class="overflow-y-scroll mt-4 xl:mx-auto xl:w-10/12 px-4 md:w-full" v-if="data">
        <FormZObjectInfo v-model="data"/>

        <Collapse title="Transform">
            <FormZTransform v-model="data.transform"></FormZTransform>
        </Collapse>
    </div>
</template>

<script setup lang="ts">
import {ZObject} from "@zernikalos/zkbuilder"
import Collapse from "@nestui/components/Collapse.vue";
import FormZTransform from "./FormZTransform.vue";
import {useVModel} from "@vueuse/core";
import FormZObjectInfo from "./FormZObjectInfo.vue";

const props = defineProps<{
    obj: ZObject
}>()
const emit = defineEmits(['update:obj'])
const data = useVModel(props, 'obj', emit)

</script>

<style scoped>

</style>
