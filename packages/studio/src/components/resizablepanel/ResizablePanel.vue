<template>
    <div ref="wrapperDiv" class="wrapper">
        <div :style="`width: ${dividerPosition}%`">
            <slot name="panel1"></slot>
        </div>

        <div class="divider" :style="`right: ${100 - dividerPosition}%`" @mousedown="startDragging" >

        </div>
        <div :style="`right: ${dividerPosition}%`">
            <slot name="panel2" ></slot>
        </div>

    </div>
</template>

<script setup lang="ts">
import {ref} from "vue"

const wrapperDiv = ref(null)
const dividerPosition = ref('10')

function startDragging() {
    document.addEventListener('mousemove', handleDragging)
    document.addEventListener('mouseup', endDragging)
}

function endDragging() {
    document.removeEventListener('mousemove', handleDragging)
    document.removeEventListener('mouseup', endDragging)
}

function handleDragging(ev: MouseEvent) {
    const div: HTMLDivElement = wrapperDiv.value as any as HTMLDivElement
    const rect = div.getBoundingClientRect()

    let xValue = 0
    if (ev.pageX < rect.left) {
        dividerPosition.value = xValue.toFixed(2)
        return
    }

    const percentage = (ev.pageX - rect.left) / rect.width * 100
    dividerPosition.value = percentage.toFixed(2)
}
</script>

<style scoped>
.wrapper {
    @apply h-full flex m-0
}
.divider {
    @apply h-screen w-1 cursor-ew-resize border-l border-l-gray-400
}
</style>
