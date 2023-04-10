<template>
    <q-item clickable v-ripple :active="routeName === props.routeName" :to="props.routeDest">
        <q-item-section avatar>
            <q-icon :name="props.icon" />
        </q-item-section>
<!--        <q-item-section>-->
<!--            Import-->
<!--        </q-item-section>-->
        <q-tooltip anchor="center end" self="center start" transition-show="fade" transition-hide="fade">
            {{props.tooltip}}
        </q-tooltip>
    </q-item>
</template>

<script setup lang="ts">
import {computed} from "vue"
import {useRoute} from "vue-router"

const routeName = computed(() => useRoute().name)

const props = defineProps<{
    icon: string
    routeName: string
    routeDest: string
    tooltip: string
}>()

</script>

<style scoped>

</style>
