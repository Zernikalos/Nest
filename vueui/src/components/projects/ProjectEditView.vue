<script setup lang="ts">
import { ref, watch } from 'vue';
import { useProject } from '@/composables/useProject';
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardContent from '@/components/ui/CardContent.vue';
import Label from '@/components/ui/Label.vue';
import Input from '@/components/ui/Input.vue';

const { projectMetadata, projectFilePath, isLoading, error } = useProject();
const projectName = ref(projectMetadata.value?.name ?? '');

watch(
  () => projectMetadata.value?.name,
  (name) => {
    if (name) projectName.value = name;
  }
);
</script>

<template>
  <div v-if="isLoading" class="flex h-full items-center justify-center p-6">
    <p class="text-muted-foreground">Loading project...</p>
  </div>
  <div v-else-if="error" class="flex h-full items-center justify-center p-6">
    <p class="text-error">Error loading project: {{ error.message }}</p>
  </div>
  <div v-else-if="projectMetadata" class="h-full overflow-auto bg-base-100">
    <div class="max-w-4xl mx-auto px-8 py-12">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-base-foreground mb-2">Project Settings</h1>
        <p class="text-sm text-muted-foreground">
          Configure your project settings and manage assets
        </p>
      </div>
      <div class="space-y-6">
        <Card class="bg-base-100 border-base-300">
          <CardHeader class="pb-4">
            <CardTitle class="text-base font-semibold">General</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="project-name">Project Name</Label>
              <Input
                id="project-name"
                v-model="projectName"
                type="text"
                placeholder="Enter project name"
                class="max-w-md"
              />
            </div>
            <div v-if="projectFilePath" class="space-y-2">
              <Label>Project Path</Label>
              <div
                class="text-sm text-muted-foreground font-mono bg-base-200 px-3 py-2 rounded-md border border-base-300 max-w-md break-all"
              >
                {{ projectFilePath }}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card class="bg-base-100 border-base-300">
          <CardHeader class="pb-4">
            <CardTitle class="text-base font-semibold">Input Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">No assets yet. Add assets from the Editor.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
