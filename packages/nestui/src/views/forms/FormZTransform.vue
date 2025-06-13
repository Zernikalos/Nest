<template>
    <FormGrid>
        <FormRow label="Position">
            <FormVectorInput v-model="data.position" type="vec3" />
        </FormRow>
        <FormRow label="Rotation">
            <FormVectorInput v-model="data.rotation" type="quat" />
        </FormRow>
        <FormRow label="Scale">
            <FormVectorInput v-model="data.scale" type="vec3" />
        </FormRow>
    </FormGrid>
</template>

<script setup lang="ts">
import { ZTransform } from "@zernikalos/zkbuilder"
import { useVModel } from "@vueuse/core"
import FormVectorInput from "@nestui/components/forms/FormVectorInput.vue";
import FormRow from "@nestui/components/forms/FormRow.vue";
import FormGrid from "@nestui/components/forms/FormGrid.vue";

const props = defineProps<{
    modelValue: ZTransform
}>()

const emit = defineEmits(["update:modelValue"])
const data = useVModel(props, "modelValue", emit)

</script>

<style scoped>

</style>
