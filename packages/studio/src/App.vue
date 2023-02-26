<template>
    <div class="flex flex-col h-screen">
        <Navbar></Navbar>
        <div class="h-full flex space-x-4">
            <Sidebar></Sidebar>
            <RouterView class="mt-5 pr-5 pb-5 grow"/>
        </div>
    </div>
</template>

<script setup>
import {RouterView} from 'vue-router'
import Navbar from "@studio/components/Navbar.vue";
import Sidebar from "@studio/components/sidebar/Sidebar.vue";
</script>

<style scoped>

</style>
