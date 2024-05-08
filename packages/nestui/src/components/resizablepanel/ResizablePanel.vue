<template>
    <div ref="dividerDiv" class="divider-container">
        <div :style="`width: ${dividerPosition}%`" class="panel1">
            <slot name="panel1"></slot>
        </div>

        <div class="divider-f" :style="`right: ${100 - dividerPosition}%`" @mousedown="startDragging"></div>

        <div :style="{width: `${100 - dividerPosition}%`}" class="panel2 overflow-hidden">
            <slot name="panel2" ></slot>
        </div>

    </div>
</template>

<script setup lang="ts">
import {ref} from "vue"

const dividerDiv = ref(null)
const dividerPosition = ref(10)

function startDragging() {
    document.addEventListener('mousemove', handleDragging)
    document.addEventListener('mouseup', endDragging)
}

function endDragging() {
    document.removeEventListener('mousemove', handleDragging)
    document.removeEventListener('mouseup', endDragging)
}

function handleDragging(ev: MouseEvent) {
    const div: HTMLDivElement = dividerDiv.value as any as HTMLDivElement
    const rect = div.getBoundingClientRect()

    let xValue = 0
    if (ev.pageX < rect.left) {
        dividerPosition.value = xValue.toFixed(2)
        return
    }

    const percentage = (ev.pageX - rect.left) / rect.width * 100

    // if (percentage <= 2) {
    //     dividerPosition.value = "0"
    //     return
    // }

    dividerPosition.value = percentage.toFixed(2)
}
</script>

<style scoped>
.panel1 {
    @apply z-20
}
.panel2 {
    @apply mx-auto
}
.divider-container {
    @apply mx-auto flex m-0 pb-0 w-full h-full
}
.divider-f {
    /*
    z-20 is required for better grabbing
     */
    @apply h-full cursor-ew-resize border-l border-l-neutral z-20
}
.divider-f:hover {
    cursor: col-resize;
}
</style>
