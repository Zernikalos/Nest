<template>
    <div class="flex flex-col mt-6 px-6 py-4 md:px-8 md:py-6 min-h-screen">
        <h1 class="text-3xl font-bold mb-10 text-base-content">Settings</h1>

        <!-- Settings Content Area -->
        <div class="max-w-3xl w-full space-y-8">

            <!-- Theme Setting Section -->
            <section aria-labelledby="theme-heading" class="max-w-lg mx-auto w-full">
                <h2 id="theme-heading" class="text-xl font-semibold mb-2 text-base-content/90">Appearance</h2>
                <div class="bg-base-200 p-4 sm:p-6 rounded-lg shadow">
                    <div class="space-y-4">
                        <div>
                            <label for="theme-select" class="block text-sm font-medium text-base-content/80 mb-1">Theme</label>
                            <Select
                                id="theme-select"
                                :options="userSettingsStore.availableThemes"
                                :model-value="userSettingsStore.theme"
                                @update:model-value="userSettingsStore.setTheme"
                                size="sm"
                            />
                            <p class="text-xs text-base-content/60 mt-1.5">Select your preferred interface theme.</p>
                        </div>
                        <div>
                            <label for="font-select" class="block text-sm font-medium text-base-content/80 mb-1">Font Family</label>
                            <Select
                                id="font-select"
                                :options="userSettingsStore.availableFonts" 
                                :model-value="userSettingsStore.fontFamily"
                                @update:model-value="userSettingsStore.setFontFamily"
                                size="sm"
                            />
                            <p class="text-xs text-base-content/60 mt-1.5">Choose the primary font for the interface.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Add more sections here as needed -->
            <!-- Example:
            <section aria-labelledby="editor-heading">
                <h2 id="editor-heading" class="text-xl font-semibold mb-2 text-base-content/90">Editor Preferences</h2>
                <div class="bg-base-200 p-4 sm:p-6 rounded-lg shadow">
                    <p class="text-sm text-base-content/70">Editor settings will go here...</p>
                </div>
            </section>
            -->
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
