<template>
    <div class="flex flex-col h-screen">
        <div class="flex h-[96%]">
            <Sidebar class="w-14" />
            <div class="wrapper h-full">
                <RouterView
                    id="router-view"
                    v-slot="{ Component }"
                >
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
import Sidebar from "@nestui/components/sidebar/Sidebar.vue"

</script>

<style scoped>
.wrapper {
    width: calc(theme(width.full) - theme(width.14));
}

</style>