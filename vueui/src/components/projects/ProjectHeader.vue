<script setup lang="ts">
import { inject } from 'vue';
import { useProject } from '@/composables/useProject';
import { useProjectUIStore } from '@/stores/projectUIStore';
import CreateProjectDialog from '@/components/CreateProjectDialog.vue';
import Button from '@/components/ui/Button.vue';
import { Plus, FolderOpen } from 'lucide-vue-next';
import { HOST_PORT_KEY, type HostPort } from '@/types/hostPort';

const { createProjectWithDialog, openProject } = useProject();
const projectUIStore = useProjectUIStore();
const hostPort = inject<HostPort>(HOST_PORT_KEY);

async function handleOpen() {
  try {
    const filePath = await hostPort?.showOpenProjectDialog?.();
    if (!filePath) return;
    await openProject(filePath);
  } catch (e) {
    console.error('Failed to open project:', e);
  }
}
</script>

<template>
  <div class="text-center mb-12">
    <div class="flex items-center justify-center gap-3 mb-6">
      <img src="/zklogo.svg" alt="Zernikalos" class="h-12 w-12 select-none" width="48" height="48" />
      <h1 class="text-5xl font-bold text-primary">Nest – Zernikalos</h1>
    </div>
    <p class="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
      Create stunning 3D experiences with our powerful visual editor.
      Build, animate, and deploy interactive content effortlessly.
    </p>
    <div class="flex gap-4 justify-center">
      <Button
        size="lg"
        class="px-6 py-2 text-base font-medium"
        @click="projectUIStore.setIsCreateDialogOpen(true)"
      >
        <Plus class="size-4" />
        New Project
      </Button>
      <Button
        size="lg"
        variant="outline"
        class="px-6 py-2 text-base font-medium"
        @click="handleOpen"
      >
        <FolderOpen class="size-4" />
        Open Project
      </Button>
    </div>
    <CreateProjectDialog
      :open="projectUIStore.isCreateDialogOpen"
      :is-creating="projectUIStore.isCreating"
      :error="projectUIStore.creationError"
      :on-create="createProjectWithDialog"
      @update:open="projectUIStore.setIsCreateDialogOpen($event)"
    />
  </div>
</template>
