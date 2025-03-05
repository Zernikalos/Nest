<template>
    <Icon :icon="arrowDirectionIcon" :class="{invisible: !visible}"/>
</template>

<script setup lang="ts">

import {computed} from "vue"
import Icon from "@nestui/components/Icon.vue"

const props = defineProps<{
    direction: "right" | "down"
    visible: boolean
}>()

const arrowDirectionIcon = computed(() =>
    props.direction === "right" ? "chevron-right" : "chevron-down"
)

</script>

<style scoped>

</style>