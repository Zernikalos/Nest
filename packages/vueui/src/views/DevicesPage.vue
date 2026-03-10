<script setup lang="ts">
defineOptions({ name: 'DevicesPage' });
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardDescription from '@/components/ui/CardDescription.vue';
import CardContent from '@/components/ui/CardContent.vue';
import Badge from '@/components/ui/Badge.vue';
import Separator from '@/components/ui/Separator.vue';
import { Wifi, ShieldCheck, Smartphone, Cpu } from 'lucide-vue-next';
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Devices</h1>
        <p class="text-muted-foreground mt-2">
          Manage and monitor your connected devices
        </p>
      </div>
      <Badge variant="secondary" class="flex items-center gap-2">
        <Wifi class="size-4" />
        Online
      </Badge>
    </div>
    <div class="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <ShieldCheck class="size-5" />
            Debug Configuration
          </CardTitle>
          <CardDescription>
            Use this key to connect your devices to the debugger
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">Debugger key placeholder.</p>
        </CardContent>
      </Card>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Smartphone class="size-5" />
            Connected Devices
          </CardTitle>
          <CardDescription>
            Currently connected devices and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="text-center py-8 text-muted-foreground">
              <Cpu class="size-12 mx-auto mb-4 opacity-50" />
              <p>No devices connected</p>
              <p class="text-sm">Use the debug key above to connect a device</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
