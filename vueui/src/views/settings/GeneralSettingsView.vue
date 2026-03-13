<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settingsStore';
import type { GeneralFormData } from '@/stores/settingsStore';
import SettingsMainContainer from '@/components/settings/SettingsMainContainer.vue';
import SettingsSectionItem from '@/components/settings/SettingsSectionItem.vue';
import SettingsFieldSwitch from '@/components/settings/SettingsFieldSwitch.vue';
import SettingsFieldInput from '@/components/settings/SettingsFieldInput.vue';
import SettingsFieldSelect from '@/components/settings/SettingsFieldSelect.vue';
import Button from '@/components/ui/Button.vue';
import { Settings } from 'lucide-vue-next';

defineOptions({ name: 'GeneralSettingsView' });

const settingsStore = useSettingsStore();
const isSaved = ref(false);
const form = reactive<GeneralFormData>({
  confirmBeforeExit: true,
  reopenProjectsOnStartup: true,
  autoSaveInactivitySeconds: 30,
  saveOnClose: 'ask',
});

onMounted(() => {
  Object.assign(form, settingsStore.getGeneralSettings);
});

function handleSubmit() {
  settingsStore.updateGeneralSettings(form);
  isSaved.value = true;
  setTimeout(() => (isSaved.value = false), 1500);
}
</script>

<template>
  <SettingsMainContainer
    title="General"
    description="Configure general application behavior and preferences"
  >
    <form id="general-settings-form" class="space-y-6" @submit.prevent="handleSubmit">
      <SettingsSectionItem
        title="Exit Confirmation"
        description="Ask for confirmation before closing the application"
      >
        <template #icon>
          <Settings class="h-5 w-5" />
        </template>
        <SettingsFieldSwitch
          :title="'Confirm before exit'"
          :description="'Show a confirmation dialog when trying to close the application'"
          :checked="form.confirmBeforeExit"
          @update:checked="form.confirmBeforeExit = $event"
        />
      </SettingsSectionItem>

      <SettingsSectionItem
        title="Project Management"
        description="Configure how projects are handled on application startup"
      >
        <SettingsFieldSwitch
          title="Reopen projects on startup"
          description="Automatically reopen the last opened projects when starting the application"
          :checked="form.reopenProjectsOnStartup"
          @update:checked="form.reopenProjectsOnStartup = $event"
        />
      </SettingsSectionItem>

      <SettingsSectionItem
        title="Auto-save Settings"
        description="Configure automatic saving behavior when the editor is inactive"
      >
        <SettingsFieldInput
          title="Auto-save on inactivity"
          description="Automatically save the project if the editor is inactive for a specified time"
          :value="form.autoSaveInactivitySeconds"
          type="number"
          :min="5"
          :max="300"
          input-class="w-20"
          suffix="seconds"
          @update:value="form.autoSaveInactivitySeconds = Number($event)"
        />
      </SettingsSectionItem>

      <SettingsSectionItem
        title="Save on Close"
        description="Configure what happens when closing a project"
      >
        <SettingsFieldSelect
          title="Save behavior when closing"
          description="Choose what happens when you close a project"
          :model-value="form.saveOnClose"
          :options="[
            { value: 'always', label: 'Always save' },
            { value: 'never', label: 'Never save' },
            { value: 'ask', label: 'Ask each time' },
          ]"
          @update:model-value="form.saveOnClose = $event as GeneralFormData['saveOnClose']"
        />
      </SettingsSectionItem>
    </form>
    <template #actions>
      <Button
        type="submit"
        form="general-settings-form"
        class="px-6 w-[100px]"
        :variant="isSaved ? 'success' : 'default'"
      >
        {{ isSaved ? 'Saved ✓' : 'Save' }}
      </Button>
    </template>
  </SettingsMainContainer>
</template>
