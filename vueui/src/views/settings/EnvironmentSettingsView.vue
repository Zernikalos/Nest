<script setup lang="ts">
import { computed } from 'vue';
import SettingsSectionItem from '@/components/settings/SettingsSectionItem.vue';
import InfoDisplayItem from '@/components/settings/InfoDisplayItem.vue';
import { Info, Monitor, Wrench } from 'lucide-vue-next';

defineOptions({ name: 'EnvironmentSettingsView' });

// Zernikalos engine and ZKBuilder versions - when those packages are available
// (e.g. in Nest/Electron context), they can be injected. For standalone vueui, show Unavailable.
const engineVersion = 'Unavailable';
const builderVersion = 'Unavailable';
const engineZkoVersion: string | undefined = undefined;
const builderZkoVersion: string | undefined = undefined;

const engineMissing = computed(() => engineZkoVersion == null);
const builderMissing = computed(() => builderZkoVersion == null);
const zkoVersionMismatch = computed(
  () =>
    !engineMissing.value &&
    !builderMissing.value &&
    engineZkoVersion !== builderZkoVersion
);
const zkoVersion = computed(() =>
  zkoVersionMismatch.value
    ? 'Unavailable'
    : engineZkoVersion ?? builderZkoVersion ?? 'Unknown'
);
const engineError = computed(() =>
  engineMissing.value ? 'Engine version is missing.' : undefined
);
const builderError = computed(() =>
  builderMissing.value ? 'Builder version is missing.' : undefined
);
const zkoError = computed(() =>
  zkoVersionMismatch.value
    ? `Engine and builder target different ZKO versions; align them to avoid incompatibilities.`
    : undefined
);

const appVersion = computed(
  () =>
    (import.meta as unknown as { __APP_VERSION__?: string }).__APP_VERSION__ ??
    'Unknown'
);

const platform = computed(
  () => (typeof navigator !== 'undefined' ? navigator.platform : 'Unknown')
);
const userAgent = computed(
  () => (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown')
);

const envMode = computed(
  () =>
    (import.meta as unknown as { env?: { MODE?: string } }).env?.MODE ??
    'development'
);
const buildTime = computed(
  () =>
    (import.meta as unknown as { env?: { BUILD_TIME?: string } }).env
      ?.BUILD_TIME ?? 'Unknown'
);
</script>

<template>
  <div class="h-full flex flex-col flex-1">
    <div class="flex-1 overflow-y-auto space-y-6 p-6">
      <div>
        <h2 class="text-2xl font-bold">Environment Information</h2>
        <p class="text-muted-foreground">
          System and application environment details
        </p>
      </div>

      <SettingsSectionItem
        title="Zernikalos Engine"
        description="Core rendering engine version and information"
      >
        <template #icon>
          <Wrench class="h-5 w-5" />
        </template>
        <div class="space-y-2">
          <InfoDisplayItem
            label="Engine Version"
            :value="engineVersion"
            :has-error="engineMissing"
            :error-messages="engineError"
          />
          <InfoDisplayItem
            label="Builder Version"
            :value="builderVersion"
            :has-error="builderMissing"
            :error-messages="builderError"
          />
          <InfoDisplayItem
            label="ZKO Version"
            :value="zkoVersion"
            :has-error="zkoVersionMismatch"
            :error-messages="zkoError"
          />
        </div>
      </SettingsSectionItem>

      <SettingsSectionItem
        title="Application Details"
        description="Application version and build information"
      >
        <template #icon>
          <Info class="h-5 w-5" />
        </template>
        <div class="space-y-2">
          <InfoDisplayItem label="Nest Version" :value="appVersion" />
          <InfoDisplayItem label="Environment" :value="envMode" />
          <InfoDisplayItem
            label="Build Time"
            :value="buildTime"
            class="bg-base-100 font-normal text-base-foreground"
          />
        </div>
      </SettingsSectionItem>

      <SettingsSectionItem
        title="System Information"
        description="Operating system and platform details"
      >
        <template #icon>
          <Monitor class="h-5 w-5" />
        </template>
        <div class="space-y-2">
          <InfoDisplayItem
            label="Platform"
            :value="platform"
            class="bg-base-100 font-normal text-base-foreground"
          />
          <InfoDisplayItem
            label="User Agent"
            :value="userAgent"
            class="bg-base-100 text-xs max-w-xs truncate text-base-foreground"
          />
        </div>
      </SettingsSectionItem>
    </div>
  </div>
</template>
