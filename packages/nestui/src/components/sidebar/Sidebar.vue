<template>
    <div class="sidebar">
        <ul class="flex flex-col h-full">
            <SidebarItem :id="0" path="/editor" name="Editor" :selected="routeName === 'editor'" icon="bi-journal-code" />
            <SidebarItem :id="1" path="/exporter" name="Export" :selected="routeName === 'exporter'" icon="bi-boxes" />
            <SidebarItem class="mt-auto" name="Settings" :id="2" path="/settings" :selected="routeName === 'settings'" icon="bi-gear" />
        </ul>
    </div>
</template>

<script setup>
import SidebarItem from "@nestui/components/sidebar/SidebarItem.vue"
import {computed} from "vue"
import {useRoute} from "vue-router"

const routeName = computed(() => useRoute().name)

</script>

<style scoped lang="postcss">
.sidebar {
    @apply shadow-md pl-0 px-1 border-r  border-base-content
}
.margin-auto {
    margin-top: auto;
}

</style>
