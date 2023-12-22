<template>
    <div class="h-screen">
        <div class="grid grid-rows-[48px_minmax(0,1fr)] h-screen">
            <div>
                <Navbar class="min-h-12 max-h-12"></Navbar>
            </div>
            <div class="grid grid-rows-1 grid-cols-[56px_minmax(0,1fr)]">
                <Sidebar class="w-14"></Sidebar>
                <RouterView id="router-view" v-slot="{ Component }">
                    <keep-alive>
                        <component :is="Component" />
                    </keep-alive>
                </RouterView>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import {RouterView} from "vue-router"
import Navbar from "@studio/components/Navbar.vue"
import Sidebar from "@studio/components/sidebar/Sidebar.vue"

</script>

<style scoped>

</style>