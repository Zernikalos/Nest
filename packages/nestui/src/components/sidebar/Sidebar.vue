<template>
    <div class="sidebar">
        <div class="flex flex-col h-full">
            <div class="flex-1">
                <div class="align-middle p-2 h-12">
                    <Logo />
                </div>
                <SidebarItem
                    :id="0"
                    path="/editor"
                    name="Editor"
                    :selected="routeName === 'editor'"
                    icon="journal-code"
                />
                <SidebarItem
                    :id="1"
                    path="/devices"
                    name="Devices"
                    :selected="routeName === 'devices'"
                    icon="phone"
                />
                <SidebarItem
                    :id="2"
                    path="/exporter"
                    name="Export"
                    :selected="routeName === 'exporter'"
                    icon="boxes"
                />
            </div>
            <div>
                <SidebarItem
                    :id="2"
                    name="Settings"
                    path="/settings"
                    :selected="routeName === 'settings'"
                    icon="gear"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import SidebarItem from "@nestui/components/sidebar/SidebarItem.vue"
import {computed} from "vue"
import {useRoute} from "vue-router"
import Logo from "@nestui/components/Logo.vue"

const router = useRoute()

const routeName = computed(() => router.name)

</script>

<style scoped>
@reference "@nestui/assets/main.css";

.sidebar {
    @apply shadow-md pl-0 px-1 bg-base-300 max-w-[56px] max-h-screen h-screen
}

</style>
