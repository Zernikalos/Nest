<script setup lang="ts">
defineOptions({ name: 'DebuggerKey' });
import { ref, computed, onMounted } from 'vue';
import { getDebugKey } from '@/lib/debuggerApi';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Tooltip from '@/components/ui/Tooltip.vue';
import Badge from '@/components/ui/Badge.vue';
import { Clipboard, Check, Eye, EyeOff } from 'lucide-vue-next';

const deviceKey = ref('');
const copyState = ref('Copy');
const isVisible = ref(false);
const isLoading = ref(true);

const displayKey = computed(() =>
  isVisible.value ? deviceKey.value : '•'.repeat(deviceKey.value.length)
);

onMounted(async () => {
  try {
    isLoading.value = true;
    const key = await getDebugKey();
    deviceKey.value = key;
  } catch (error) {
    console.error('Failed to fetch debug key:', error);
  } finally {
    isLoading.value = false;
  }
});

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(deviceKey.value);
    copyState.value = 'Copied!';
    setTimeout(() => {
      copyState.value = 'Copy';
    }, 1500);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
  }
}

function toggleVisibility() {
  isVisible.value = !isVisible.value;
}
</script>

<template>
  <div v-if="isLoading" class="space-y-3">
    <div class="h-10 bg-base-200 animate-pulse rounded-md" />
    <div class="flex justify-center">
      <Badge variant="outline">Loading...</Badge>
    </div>
  </div>

  <div v-else class="space-y-4">
    <div class="flex items-center gap-2 group">
      <Input
        :model-value="displayKey"
        readonly
        class="text-center select-none cursor-pointer font-mono text-sm shrink min-w-0"
        @click="handleCopy"
      />
      <Tooltip>
        <template #trigger>
          <Button
            variant="outline"
            size="icon"
            class="shrink-0"
            @click="toggleVisibility"
          >
            <EyeOff v-if="isVisible" class="size-4" />
            <Eye v-else class="size-4" />
          </Button>
        </template>
        <p>{{ isVisible ? 'Hide' : 'Show' }} key</p>
      </Tooltip>
      <Tooltip>
        <template #trigger>
          <Button
            variant="outline"
            size="icon"
            class="shrink-0"
            @click="handleCopy"
          >
            <Check
              v-if="copyState === 'Copied!'"
              class="size-4 text-green-600"
            />
            <Clipboard v-else class="size-4" />
          </Button>
        </template>
        <p>{{ copyState }}</p>
      </Tooltip>
    </div>

    <div class="flex justify-center">
      <Badge
        :variant="copyState === 'Copied!' ? 'default' : 'secondary'"
        class="transition-colors"
      >
        {{
          copyState === 'Copied!'
            ? '✓ Key copied to clipboard'
            : 'Click to copy'
        }}
      </Badge>
    </div>
  </div>
</template>
