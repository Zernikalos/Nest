<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import {
  FolderOpen,
  Code2,
  Smartphone,
  Rocket,
  Settings,
} from 'lucide-vue-next';
import SidebarItem from './SidebarItem.vue';
import { cn } from '@/lib/utils';

const route = useRoute();

function isPathPrefix(prefix: string, path: string): boolean {
  if (prefix === path) return true;
  const normalized = path.endsWith('/') ? path.slice(0, -1) : path;
  const prefixNorm = prefix.endsWith('/') ? prefix : prefix + '/';
  return normalized === prefix || normalized.startsWith(prefixNorm);
}

const currentPath = computed(() => route.path);

function isActive(path: string): boolean {
  if (path === '/editor') {
    return currentPath.value === '/' || isPathPrefix('/editor', currentPath.value);
  }
  return isPathPrefix(path, currentPath.value);
}
</script>

<template>
  <aside
    :class="cn(
      'shadow-md pl-0 bg-base-200 w-[56px] flex-shrink-0 h-screen border-r border-base-300'
    )"
  >
    <div class="flex flex-col h-full">
      <div class="flex-1">
        <div class="align-middle p-2 h-12 flex items-center justify-center">
          <span class="text-xl font-bold text-primary">ZK</span>
        </div>
        <SidebarItem path="/projects" name="Projects" :selected="isActive('/projects')">
          <template #icon><FolderOpen class="size-6" /></template>
        </SidebarItem>
        <SidebarItem path="/editor" name="Editor" :selected="isActive('/editor')">
          <template #icon><Code2 class="size-6" /></template>
        </SidebarItem>
        <SidebarItem path="/devices" name="Devices" :selected="isActive('/devices')">
          <template #icon><Smartphone class="size-6" /></template>
        </SidebarItem>
        <SidebarItem path="/exporter" name="Export" :selected="isActive('/exporter')">
          <template #icon><Rocket class="size-6" /></template>
        </SidebarItem>
      </div>
      <div>
        <SidebarItem path="/settings" name="Settings" :selected="isActive('/settings')">
          <template #icon><Settings class="size-6" /></template>
        </SidebarItem>
      </div>
    </div>
  </aside>
</template>
