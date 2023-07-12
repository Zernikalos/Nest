<template>
    <div class="flex flex-col h-screen">
        <Navbar class=""></Navbar>
        <div class="flex flex-grow max-h-fit">
            <Sidebar></Sidebar>
            <RouterView id="router-view" class="wrapper"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import {RouterView} from "vue-router";
import Navbar from "@studio/components/Navbar.vue";
import Sidebar from "@studio/components/sidebar/Sidebar.vue";
</script>

<style scoped>
.wrapper {
    @apply mt-5 pr-5 pb-5 grow
}

</style>