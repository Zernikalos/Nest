<template>
    <div
        ref="debuggerKeyContainer"
        class="input input-bordered flex items-center gap-2 rounded"
        :class="{'cursor-pointer': isHovered}"
        @click="handleCopyButton()"
    >
        <span type="text" class="grow text-center select-none">{{deviceKey}}</span>
        <div :data-tip="copyState" class="tooltip tooltip-top" :class="{'tooltip-open': isHovered}">
            <button class="btn btn-square rounded btn-sm btn-neutral" :class="{'invisible': !isHovered}">
                <i class="bi bi-clipboard"></i>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue"
import {useNestApiStore} from "@zernikalos/store"
import {useElementHover} from "@vueuse/core";

const nestApiStore = useNestApiStore()

const deviceKey = ref<string>("")
const copyState = ref<string>("Copy")

const debuggerKeyContainer = ref(null)
const isHovered = useElementHover(debuggerKeyContainer)

onMounted(async () => {
    deviceKey.value = await nestApiStore.requestDebugKey()
})

function handleCopyButton() {
    navigator.clipboard.writeText(deviceKey.value)
    copyState.value = "Copied!"
    setTimeout(() => {
        copyState.value = "Copy"
    }, 1500)
}
</script>

<style scoped>

</style>