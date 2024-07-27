<template>
    <div :data-theme="userSettingsStore.theme">
        <GridLayout></GridLayout>
    </div>
</template>

<script setup>
import {useNativeNest, useNestApiStore, useUserSettingsStore} from "@zernikalos/store"
import GridLayout from "@nestui/layouts/GridLayout.vue";

useNativeNest()
const nestApiStore = useNestApiStore()
nestApiStore.connectNestWebSocket("ws://localhost:3000/nest")
    .subscribe(msg => console.log(msg))

const userSettingsStore = useUserSettingsStore()

</script>

<style scoped>

</style>
