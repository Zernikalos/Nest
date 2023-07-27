<template>
    <div ref="wrapperDiv" class="wrapper-div">
        <div :style="`width: ${dividerPosition}%`" class="panel1">
            <slot name="panel1"></slot>
        </div>

        <div class="divider-f" :style="`right: ${100 - dividerPosition}%`" @mousedown="startDragging"></div>

        <div :style="{width: `${100 - dividerPosition}%`, 'max-width': `${100 - dividerPosition}%`}" class="panel2">
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

}
.wrapper-div {
    @apply h-full flex m-0 pb-0 max-w-full w-full
}
.divider-f {
    @apply h-full w-1 cursor-ew-resize border-l border-l-neutral-content
}
.divider-f:hover {
    cursor: col-resize;
}
</style>
