<template>
    <div class="flex flex-col">
        <Input
            v-model="data.refId"
            label="ID"
            disabled
        />
        <Input
            v-model="data.name"
            label="Name"
        />
        <Select
            v-model="data.type.name"
            label="Object type"
            :options="zObjectTypeNames"
        />
    </div>
</template>

<script setup lang="ts">
import {ZObject, ZObjectType} from "@zernikalos/zkbuilder"
import {useVModel} from "@vueuse/core"
import Select from "@nestui/components/Select.vue"
import Input from "../../components/Input.vue"
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