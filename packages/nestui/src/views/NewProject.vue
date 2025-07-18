<template>
    <div class="flex h-full justify-center items-center">
        <Button variant="solid" color="info" @click="createNewProject">
            New Project
        </Button>
    </div>
</template>

<script setup lang="ts">
import Button from "@nestui/components/Button.vue"
import { useNativeNest } from "../store/nativeStore"

const nativeNest = useNativeNest()

function createNewProject() {
    nativeNest.createNewProject()
}
</script>

<style scoped>

</style>