<template>
    <div v-if="hasDevicesConnected" class="flex flex-col flex-grow">
        <div class="mx-[15%]">
            <div class="label">
                <span class="label-text">ZDebugger Key</span>
            </div>
            <ZDebuggerKey></ZDebuggerKey>
        </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center gap-2 mx-[15%]">
        <span class="bi bi-question-square text-7xl"></span>
        <span class="text-2xl">No devices detected</span>
        <span>Use the ZDebugger Key in your project to connect to Nest</span>
        <ZDebuggerKey class="w-full"></ZDebuggerKey>
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import _ from "lodash";
import ZDebuggerKey from "../views/ZDebuggerKey.vue";


const devicesList = ref([])
const hasDevicesConnected = computed(() => !_.isEmpty(devicesList.value))


</script>

<style scoped>

</style>