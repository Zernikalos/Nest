<template>
    <div class="flex flex-col h-screen">
<!--        <Navbar class="h-[5%] min-h-12 max-h-12"></Navbar>-->
        <div class="flex h-[96%]">
            <Sidebar class="w-14"></Sidebar>
            <div class="wrapper h-full">

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
import Navbar from "@nestui/components/Navbar.vue"
import Sidebar from "@nestui/components/sidebar/Sidebar.vue"

</script>

<style scoped>
.wrapper {
    width: calc(theme(width.full) - theme(width.14));
}

</style>