<template>
    <div :data-theme="userSettingsStore.theme">
        <GridLayout />
    </div>
</template>

<script setup>
import {useNativeNest, useNestApiStore, useUserSettingsStore} from "@zernikalos/store"
import GridLayout from "@nestui/layouts/GridLayout.vue"

useNativeNest()
const nestApiStore = useNestApiStore()
nestApiStore.connectNestWebSocket()
    .subscribe(msg => console.log(msg))

const userSettingsStore = useUserSettingsStore()

</script>

<style scoped>

</style>
