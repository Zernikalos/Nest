<template>
    <div class="sidebar w-15">
        <ul class="relative">
            <SidebarItem :id="0" path="/studio" :selected="useRouteName === 'studio'" icon="bi-journal-code" />
            <SidebarItem :id="1" path="/exporter" :selected="useRouteName === 'exporter'" icon="bi-boxes" />
        </ul>
    </div>
</template>

<script setup>
import SidebarItem from "@studio/components/sidebar/SidebarItem.vue"
import useRouteName from "@studio/hooks/useRouteName";

</script>

<style scoped lang="postcss">
.sidebar {
    @apply shadow-md bg-gray-900 pl-0 px-1 border-r border-opacity-40 border-gray-400
}
</style>
