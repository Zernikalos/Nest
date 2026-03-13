<script setup lang="ts">
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import { FolderOpen } from 'lucide-vue-next';
</script>

<template>
  <div>
    <h3 class="text-xl font-semibold mb-6 text-base-foreground">Recent Projects</h3>
    <Card>
      <CardContent class="py-12 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-base-300">
          <FolderOpen class="size-8 text-muted-foreground" />
        </div>
        <p class="text-sm text-muted-foreground">
          No recent projects found. Create a new project to get started.
        </p>
      </CardContent>
    </Card>
  </div>
</template>
