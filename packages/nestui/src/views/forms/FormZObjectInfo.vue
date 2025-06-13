<template>
    <FormGrid>
        <FormRow label="ID">
            <Input
                v-model="data.refId"
                disabled
                size="sm"
            />
        </FormRow>
        <FormRow label="Name">
            <Input
                v-model="data.name"
                size="sm"
            />
        </FormRow>
        <FormRow label="Object type">
            <Select
                v-model="data.type.name"
                :options="zObjectTypeNames"
                size="sm"
            />
        </FormRow>
    </FormGrid>
</template>

<script setup lang="ts">
import {ZObject, ZObjectType} from "@zernikalos/zkbuilder"
import {useVModel} from "@vueuse/core"
import Select from "@nestui/components/Select.vue"
import Input from "@nestui/components/Input.vue"
import FormRow from "@nestui/components/forms/FormRow.vue"
import FormGrid from "@nestui/components/forms/FormGrid.vue"
import {computed} from "vue"

const props = defineProps<{
    modelValue: ZObject
}>()
const emit = defineEmits(["update:modelValue"])
const data = useVModel(props, "modelValue", emit)

const zObjectTypeNames = computed(() => {
    return ZObjectType.values().map((v: ZObjectType) => v.name)
})
</script>

<style scoped>

</style>