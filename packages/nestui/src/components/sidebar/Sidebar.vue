<template>
    <div class="sidebar">
        <ul class="flex flex-col h-full">
            <li class="align-middle p-2 h-12">
                <Logo></Logo>
            </li>
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
import Logo from "@nestui/components/Logo.vue";

const router = useRoute()

const routeName = computed(() => router.name)

</script>

<style scoped lang="postcss">
.sidebar {
    @apply shadow-md pl-0 px-1  bg-base-300
}
.margin-auto {
    margin-top: auto;
}

</style>
