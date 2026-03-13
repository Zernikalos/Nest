<script setup lang="ts">
defineOptions({ name: 'ProjectsPage' });
import { useProject } from '@/composables/useProject';
import ProjectHeader from '@/components/projects/ProjectHeader.vue';
import ProjectTemplates from '@/components/projects/ProjectTemplates.vue';
import RecentProjects from '@/components/projects/RecentProjects.vue';
import ProjectEditView from '@/components/projects/ProjectEditView.vue';

const { isProjectOpen } = useProject();
</script>

<template>
  <div class="h-full overflow-auto bg-base-100">
    <template v-if="isProjectOpen">
      <ProjectEditView />
    </template>
    <template v-else>
      <div class="max-w-6xl mx-auto px-8 py-12">
        <ProjectHeader />
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <ProjectTemplates />
          <RecentProjects />
        </div>
      </div>
    </template>
  </div>
</template>
