<template>
    <ul class="flex">
        <li class="">
            <div class="">
                <input id="json" type="radio" value="json" name="list-radio" :checked="props.selected === 'json'" class="" @change="pickOption">
                <label for="json" class="">JSON</label>
            </div>
        </li>
        <li class="">
            <div class="">
                <input id="hexcbor" type="radio" value="hexcbor" name="list-radio" class="" :checked="props.selected === 'hexcbor'" @change="pickOption">
                <label for="hexcbor" class="">Cbor Hex</label>
            </div>
        </li>
        <li class="">
            <div class="">
                <input id="cbor" type="radio" value="cbor" name="list-radio" class="" :checked="props.selected === 'cbor'" @change="pickOption">
                <label for="cbor" class="">Cbor</label>
            </div>
        </li>
    </ul>
</template>

<script setup lang="ts">
import {defineProps, defineEmits} from "vue";

const emit = defineEmits(['update:selected'])

const props = defineProps<{
    selected: 'cbor' | 'hexcbor' | 'json'
}>()

function pickOption(ev: any) {
    emit('update:selected', ev.target.value)
}

</script>

<style scoped>

</style>
