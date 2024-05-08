<template>

    <div class="flex">
        <label class="label w-1/6">
            <span class="label-text">ID</span>
        </label>
        <input class="input input-bordered rounded w-5/6" v-model="data.id" disabled>
    </div>

    <div class="flex pt-3">
        <label class="label w-1/6">
            <span class="label-text">Name</span>
        </label>
        <input class="input input-bordered rounded w-5/6" v-model="data.name">
    </div>

    <div class="flex pt-3">
        <label class="label w-1/6">
            <span class="label-text">Object type</span>
        </label>
        <DropDownSelector class="w-5/6 rounded" :options="ZObjectType.values().map((v: ZObjectType) => v.name)" :selected="data.type.name" />
    </div>
</template>

<script setup lang="ts">
import {ZObject, ZObjectType} from "@zernikalos/zkbuilder"
import {useVModel} from "@vueuse/core";
import DropDownSelector from "@nestui/components/dropdownselector/DropDownSelector.vue";

const props = defineProps<{
    modelValue: ZObject
}>()
const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)
</script>

<style scoped>

</style>