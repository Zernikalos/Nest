<template>
    <div class="sidebar w-15">
        <ul class="flex flex-col h-full">
            <SidebarItem :id="0" path="/studio" :selected="routeName === 'studio'" icon="bi-journal-code" />
            <SidebarItem :id="1" path="/exporter" :selected="routeName === 'exporter'" icon="bi-boxes" />
            <SidebarItem class="margin-auto" :id="2" path="/settings" :selected="routeName === 'settings'" icon="bi-gear" />
        </ul>
    </div>
</template>

<script setup>
import SidebarItem from "@studio/components/sidebar/SidebarItem.vue"
import {computed} from "vue"
import {useRoute} from "vue-router"

const routeName = computed(() => useRoute().name)

</script>

<style scoped lang="postcss">
.sidebar {
    @apply shadow-md bg-base-100 pl-0 px-1 border-r border-opacity-40 border-base-content
}
.margin-auto {
    margin-top: auto;
}

</style>
