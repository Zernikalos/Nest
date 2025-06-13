<template>
    <div
        v-if="data"
        class="mt-4 overflow-y-auto w-full px-4"
    >
        <FormSection title="General">
            <FormZObjectInfo v-model="data" />
        </FormSection>

        <FormSection title="Transform">
            <FormZTransform v-model="data.transform" />
        </FormSection>
    </div>
</template>

<script setup lang="ts">
import { ZObject } from "@zernikalos/zkbuilder";
import { useVModel } from "@vueuse/core";
import FormZTransform from "@nestui/views/forms/FormZTransform.vue";
import FormZObjectInfo from "@nestui/views/forms/FormZObjectInfo.vue";
import FormSection from "@nestui/components/forms/FormSection.vue";

const props = defineProps<{
    obj: ZObject;
}>();
const emit = defineEmits(["update:obj"]);
const data = useVModel(props, "obj", emit);
</script>

<style scoped>
/* Adjust scroll container height if needed */
</style>
