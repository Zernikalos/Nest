<template>
    <div class="flex h-full justify-center items-center">
        <Button variant="solid" color="info" @click="createNewProject">
            New Project
        </Button>
    </div>
</template>

<script setup lang="ts">
import Button from "@nestui/components/Button.vue"
import { useProjectStore } from "../store/projectStore";

const projectStore = useProjectStore()

function createNewProject() {
    projectStore.createProject()
}
</script>

<style scoped>

</style>