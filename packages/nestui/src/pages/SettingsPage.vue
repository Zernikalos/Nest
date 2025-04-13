<template>
    <div class="flex flex-col mt-4">
        <span class="font-bold mx-auto mb-4 text-center text-2xl">Settings</span>
        <div class="mx-5">
            <span class="text-lg">Theme</span>
            <div class="divider mt-0" />
            <div class="w-1/2 mb-2">
                <Select
                    :options="userSettingsStore.availableThemes"
                    :model-value="userSettingsStore.theme"
                    @update:model-value="userSettingsStore.setTheme"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import Select from "@nestui/components/Select.vue"
import {useUserSettingsStore} from "@nestui/store"

const userSettingsStore = useUserSettingsStore()

</script>

<style scoped>

</style>
