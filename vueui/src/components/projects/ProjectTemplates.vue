<script setup lang="ts">
import { useProjectUIStore } from '@/stores/projectUIStore';
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardDescription from '@/components/ui/CardDescription.vue';
import CardContent from '@/components/ui/CardContent.vue';
import { FileText, Palette } from 'lucide-vue-next';

const projectUIStore = useProjectUIStore();
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold mb-6 text-base-foreground">Project Templates</h2>
    <div class="space-y-3">
      <Card
        class="cursor-pointer hover:bg-base-300/80 transition-colors"
        @click="projectUIStore.setIsCreateDialogOpen(true)"
      >
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <FileText class="size-5" />
            Empty Project
          </CardTitle>
          <CardDescription>Start with a blank canvas</CardDescription>
        </CardHeader>
      </Card>
      <Card
        class="cursor-pointer hover:bg-base-300/80 transition-colors"
        @click="projectUIStore.setIsCreateDialogOpen(true)"
      >
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Palette class="size-5" />
            3D Scene
          </CardTitle>
          <CardDescription>Basic 3D scene template</CardDescription>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>
