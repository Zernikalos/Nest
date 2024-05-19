<template>
    <GridLayout></GridLayout>
</template>

<script setup>
import {useNativeNest, useNestApiStore} from "@zernikalos/store"
import GridLayout from "@nestui/layouts/GridLayout.vue";

useNativeNest()
const nestApiStore = useNestApiStore()
nestApiStore.connectNestWebSocket("ws://localhost:3000/nest")
    .subscribe(msg => console.log(msg))

</script>

<style scoped>

</style>
