<template>
    <div class="flex flex-col">
        <label
            for="vector"
            class="mb-2 text-sm"
        >{{ label }}</label>
        <FormVectorCoordinate
            v-for="(key, index) of validKeys"
            :key="key"
            v-model="data[key]"
            class="border"
            :class="{'rounded-t border-b-0': index == 0,
                     'rounded-b border-t-0': index == size - 1,
                     'border-y-0': index > 0 && index < size -1}"
            :size="size"
            :label="key"
        />
    </div>
</template>

<script setup lang="ts">
import {computed} from "vue"
import {ZVector3, ZVector4, ZQuaternion} from "@zernikalos/zkbuilder"
import {useVModel} from "@vueuse/core"
import FormVectorCoordinate from "./FormVectorCoordinate.vue"

const props = withDefaults(defineProps<{
    label: string
    modelValue: ZVector3 | ZVector4 | ZQuaternion,
    vec3?: boolean
    vec4?: boolean
    quat?: boolean
}>(), {
    vec3: false,
    vec4: false,
    quat: false
})
const emit = defineEmits(["update:modelValue"])
const data = useVModel(props, "modelValue", emit)

const size = computed(() => {
    if (props.vec3) {
        return 3
    }
    if (props.vec4) {
        return 4
    }
    if (props.quat) {
        return 4
    }
    return 1
})

const validKeys = computed(() => {
    if (props.vec3) {
        return ["x", "y", "z"]
    }
    if (props.vec4) {
        return ["x", "y", "z", "w"]
    }
    if (props.quat) {
        return ["w", "x", "y", "z"]
    }
    return []
})


</script>

<style scoped>

</style>
