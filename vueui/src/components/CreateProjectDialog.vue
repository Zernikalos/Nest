<script setup lang="ts">
import { ref, watch } from 'vue';
import Dialog from '@/components/ui/Dialog.vue';
import DialogHeader from '@/components/ui/DialogHeader.vue';
import DialogTitle from '@/components/ui/DialogTitle.vue';
import DialogDescription from '@/components/ui/DialogDescription.vue';
import DialogFooter from '@/components/ui/DialogFooter.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Label from '@/components/ui/Label.vue';

const props = withDefaults(
  defineProps<{
    open: boolean;
    onCreate: (projectName: string) => Promise<void>;
    isCreating?: boolean;
    error?: string | null;
  }>(),
  { isCreating: false, error: null }
);

const emit = defineEmits<{ 'update:open': [value: boolean] }>();

const projectName = ref('');

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) projectName.value = '';
  }
);

function close() {
  emit('update:open', false);
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogHeader>
      <DialogTitle>Create New Project</DialogTitle>
      <DialogDescription>
        Enter a name for your new project. You'll be asked to choose where to save it.
      </DialogDescription>
    </DialogHeader>
    <form
      class="grid gap-4 py-4"
      @submit.prevent="projectName.trim() && onCreate(projectName.trim())"
    >
      <div class="grid gap-2">
        <Label for="create-project-name">Project Name</Label>
        <Input
          id="create-project-name"
          v-model="projectName"
          type="text"
          placeholder="MyProject"
          :disabled="isCreating"
        />
        <p v-if="error" class="text-sm text-error">{{ error }}</p>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" :disabled="isCreating" @click="close">
          Cancel
        </Button>
        <Button
          type="submit"
          :disabled="!projectName.trim() || isCreating"
        >
          {{ isCreating ? 'Creating...' : 'Create' }}
        </Button>
      </DialogFooter>
    </form>
  </Dialog>
</template>
