<template>
    <Navbar></Navbar>
    <div class="flex">
        <Sidebar></Sidebar>
        <RouterView class="p-5 w-full"/>
    </div>
</template>

<script setup>
import {RouterView} from 'vue-router'
import Navbar from "@studio/components/Navbar.vue";
import Sidebar from "@studio/components/Sidebar.vue";
</script>

<style scoped>

</style>
