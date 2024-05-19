<template>
    <div class="input input-bordered flex items-center gap-2 rounded">
        <input type="text" class="grow text-center" placeholder="Loading..." :value="deviceKey" readonly/>
        <div :data-tip="copyState" class="tooltip tooltip-top hover:tooltip-open">
            <button class="btn btn-square rounded btn-sm btn-neutral bi-clipboard" @click="handleCopyButton()"></button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue"
import {useNestApiStore} from "@zernikalos/store"

const nestApiStore = useNestApiStore()

const deviceKey = ref<string>("")
const copyState = ref<string>("Copy")

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