<script setup lang="ts">
import { Settings, Palette, Info } from '@lucide/vue';
import { RouterView } from 'vue-router';
import SettingsSelectorSection from '@/components/settings/SettingsSelectorSection.vue';

defineOptions({ name: 'SettingsPage' });
</script>

<template>
  <div class="flex h-full bg-base-100">
    <aside class="w-80 border-r border-base-300 shrink-0 bg-base-100">
      <div class="p-4">
        <div class="flex items-center gap-2 mb-6">
          <Settings class="h-5 w-5" />
          <h1 class="text-lg font-semibold">Settings</h1>
        </div>
        <nav class="space-y-1">
          <SettingsSelectorSection
            id="general"
            name="General"
            description="General application settings"
            to="/settings/general"
          >
            <template #icon>
              <Settings class="h-4 w-4" />
            </template>
          </SettingsSelectorSection>
          <SettingsSelectorSection
            id="appearance"
            name="Appearance"
            description="Customize the look and feel of the application"
            to="/settings/appearance"
          >
            <template #icon>
              <Palette class="h-4 w-4" />
            </template>
          </SettingsSelectorSection>
          <SettingsSelectorSection
            id="environment"
            name="Environment"
            description="System and application environment information"
            to="/settings/environment"
          >
            <template #icon>
              <Info class="h-4 w-4" />
            </template>
          </SettingsSelectorSection>
        </nav>
      </div>
    </aside>
    <main class="flex-1 overflow-auto min-w-0">
      <div class="px-6 pt-6 pb-0">
        <RouterView />
      </div>
    </main>
  </div>
</template>
