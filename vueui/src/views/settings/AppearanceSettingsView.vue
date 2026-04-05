<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from 'vue';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAppearanceStore } from '@/stores/appearanceStore';
import { getThemeInfo, getThemeNames, AVAILABLE_FONTS } from '@/lib/themes';
import SettingsMainContainer from '@/components/settings/SettingsMainContainer.vue';
import SettingsSectionItem from '@/components/settings/SettingsSectionItem.vue';
import SettingsFieldSelect from '@/components/settings/SettingsFieldSelect.vue';
import SettingsFieldGeneric from '@/components/settings/SettingsFieldGeneric.vue';
import Button from '@/components/ui/Button.vue';
import { Palette, Type } from '@lucide/vue';

defineOptions({ name: 'AppearanceSettingsView' });

const settingsStore = useSettingsStore();
const appearanceStore = useAppearanceStore();

const form = reactive({
  theme: 'default',
  font: 'Rajdhani',
});

onMounted(() => {
  form.theme = appearanceStore.theme;
  form.font = appearanceStore.font;
});

watch(
  () => form.theme,
  (theme) => {
    appearanceStore.setTheme(theme);
    settingsStore.updateAppearanceSettings({ theme });
  }
);

watch(
  () => form.font,
  (font) => {
    appearanceStore.setFont(font);
    settingsStore.updateAppearanceSettings({ font });
  }
);

const isSaved = ref(false);

function handleSave() {
  settingsStore.updateAppearanceSettings({ theme: form.theme, font: form.font });
  isSaved.value = true;
  setTimeout(() => (isSaved.value = false), 1500);
}

const themeOptions = computed(() =>
  getThemeNames().map((key) => ({
    value: key,
    label: getThemeInfo(key).name,
  }))
);

const fontOptions = computed(() =>
  AVAILABLE_FONTS.map((f) => ({ value: f, label: f }))
);
</script>

<template>
  <SettingsMainContainer
    title="Appearance"
    description="Customize the look and feel of your application"
  >
    <div class="space-y-6">
      <SettingsSectionItem
        title="Font"
        description="Choose your preferred font family"
      >
        <template #icon>
          <Type class="h-5 w-5" />
        </template>
        <SettingsFieldSelect
          title="Font Family"
          description="The font will be applied immediately and saved automatically"
          :model-value="form.font"
          :options="fontOptions"
          placeholder="Select a font"
          @update:model-value="form.font = $event"
        />
      </SettingsSectionItem>

      <SettingsSectionItem
        title="Theme"
        description="Choose your preferred color scheme and theme"
      >
        <template #icon>
          <Palette class="h-5 w-5" />
        </template>
        <SettingsFieldSelect
          title="Theme"
          description="The theme will be applied immediately and saved automatically"
          :model-value="form.theme"
          :options="themeOptions"
          placeholder="Select a theme"
          @update:model-value="form.theme = $event"
        />

        <SettingsFieldGeneric
          title="Theme Preview"
          description="See how your selected theme looks"
          layout="vertical"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              class="p-4 bg-base-100 border border-base-300 rounded-lg shadow-sm"
            >
              <h4 class="font-medium mb-2 text-base-foreground">Primary Card</h4>
              <p class="text-base-foreground/70 mb-3">
                This card shows how the theme affects different elements.
              </p>
              <div class="flex gap-2">
                <Button size="sm">Primary</Button>
                <Button size="sm" variant="secondary">Secondary</Button>
                <Button size="sm" variant="outline">Outline</Button>
              </div>
            </div>
            <div
              class="p-4 bg-base-200 border border-base-300 rounded-lg shadow-sm"
            >
              <h4 class="font-medium mb-2 text-base-foreground">Secondary Card</h4>
              <p class="text-base-foreground/70">
                This shows the secondary background hierarchy.
              </p>
            </div>
          </div>
        </SettingsFieldGeneric>
      </SettingsSectionItem>
    </div>
    <template #actions>
      <Button
        class="px-6 w-[100px]"
        :variant="isSaved ? 'success' : 'default'"
        @click="handleSave"
      >
        {{ isSaved ? 'Saved ✓' : 'Save' }}
      </Button>
    </template>
  </SettingsMainContainer>
</template>
