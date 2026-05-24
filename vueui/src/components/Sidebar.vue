<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import {
  BIconFolder,
  BIconCodeSlash,
  BIconPhone,
  BIconRocket,
  BIconGearFill,
} from 'bootstrap-icons-vue';
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
        <!-- <div class="align-middle p-1.5 h-10 flex items-center justify-center">
          <img src="/zklogo.svg" alt="Zernikalos" class="h-8 w-8 select-none" width="32" height="32" />
        </div> -->
        <SidebarItem path="/projects" name="Projects" :selected="isActive('/projects')">
          <template #icon><BIconFolder class="size-6" /></template>
        </SidebarItem>
        <SidebarItem path="/editor" name="Editor" :selected="isActive('/editor')">
          <template #icon><BIconCodeSlash class="size-6" /></template>
        </SidebarItem>
        <SidebarItem path="/devices" name="Devices" :selected="isActive('/devices')">
          <template #icon><BIconPhone class="size-6" /></template>
        </SidebarItem>
        <SidebarItem path="/exporter" name="Export" :selected="isActive('/exporter')">
          <template #icon><BIconRocket class="size-6" /></template>
        </SidebarItem>
      </div>
      <div>
        <SidebarItem path="/settings" name="Settings" :selected="isActive('/settings')">
          <template #icon><BIconGearFill class="size-6" /></template>
        </SidebarItem>
      </div>
    </div>
  </aside>
</template>
