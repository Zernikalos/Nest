<template>
    <Icon
        class="cursor-pointer"
        ref="closeButton"
        :icon="icon"
        @click="$emit('click')"
    />
</template>

<script setup lang="ts">
import Icon from "@nestui/components/Icon.vue"
import {computed, ref} from "vue"
import {useElementHover} from "@vueuse/core"

const closeButton = ref()

const isHovered = useElementHover(closeButton)

const icon = computed(() => isHovered.value ? "x-circle-fill" : "x")

</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
</style>