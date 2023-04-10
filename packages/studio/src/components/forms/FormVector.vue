<template>
    <div class="column q-pa-md">
        {{ label }}
        <q-input
            filled
            square
            dense
            v-bind:key="label[key]"
            v-for="key of validKeys"
            :model-value="modelValue[key]"
            @update:model-value="(ev) => handleUpdate(key, ev)"
        >
            <template v-slot:prepend>
                {{key}}
            </template>
        </q-input>
    </div>
</template>

<script setup lang="ts">

import _ from "lodash"
import {computed} from "vue"
import {ZVector3, ZVector4, ZQuaternion} from "@zernikalos/zkbuilder"

type VectorType = "vec3" | "vec4" | "quat"

const props = withDefaults(defineProps<{
    label: string
    modelValue: ZVector3 | ZVector4 | ZQuaternion,
    type?: VectorType
    vec3?: boolean
    vec4?: boolean
    quat?: boolean
    keys?: string[]
}>(), {
    vec3: false,
    vec4: false,
    quat: false
})
const emit = defineEmits(["update:modelValue"])

const validKeys = computed(() => {
    if (!_.isNil(props.keys) && !_.isEmpty(props.keys)) {
        return props.keys
    }
    if (!_.isNil(props.type)) {
        return buildKeys(props.type)
    }
    if (props.vec3) {
        return buildKeys("vec3")
    }
    if (props.vec4) {
        return buildKeys("vec4")
    }
    if (props.quat) {
        return buildKeys("quat")
    }
    return []
})

function buildKeys(type: VectorType) {
    switch (type) {
    case "vec3":
        return ["x", "y", "z"]
    case "vec4":
        return ["x", "y", "z", "w"]
    case "quat":
        return ["w", "x", "y", "z"]
    }
}

function handleUpdate(key, ev: string) {
    const cpy = _.merge({}, props.modelValue, {[key]: Number(ev)})
    emit("update:modelValue", cpy)
}

</script>

<style scoped>

</style>
