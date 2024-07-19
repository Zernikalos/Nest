<template>
    <div class="flex flex-col">
        <Input v-model="data.id" label="ID" disabled></Input>
        <Input v-model="data.name" label="Name"></Input>
        <Select label="Object type" v-model="data.type.name" :options="zObjectTypeNames"/>
    </div>
</template>

<script setup lang="ts">
import {ZObject, ZObjectType} from "@zernikalos/zkbuilder"
import {useVModel} from "@vueuse/core"
import Select from "@nestui/components/Select.vue"
import Input from "../../components/Input.vue"
import {computed} from "vue";

const props = defineProps<{
    modelValue: ZObject
}>()
const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)

const zObjectTypeNames = computed(() => {
    return ZObjectType.values().map((v: ZObjectType) => v.name)
})
</script>

<style scoped>

</style>