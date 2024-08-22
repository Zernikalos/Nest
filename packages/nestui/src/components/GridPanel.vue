<template>

    <div>
        <div ref="gridPanel" class="grid-panel h-full w-full overflow-hidden break-normal" :style="[gridClass]">
            <div class="panel1">
                <slot name="panel1"></slot>
            </div>

            <div ref="divider" class="divider-f" :class="[dividerClass]"></div>

            <div class="panel2">
                <slot name="panel2"></slot>
            </div>

        </div>
    </div>

</template>

<script setup lang="ts">

import {computed, ref} from "vue";
import {useMouse, useMousePressed} from "@vueuse/core"
import _ from "lodash"

const props = withDefaults(defineProps<{
    orientation?: "horizontal" | "vertical",
    minmaxPercentage?: {min?: number, max?: number}
}>(), {
    orientation: "horizontal",
    minmaxPercentage: {min: 0.1, max: 99.5}
})

const divider = ref(null)
const gridPanel = ref(null)
const currentDividerPercentage = ref("10")

const gridClass = computed(() => {
    if (props.orientation === "horizontal") {
        return `grid-template-columns: ${dividerPosition.value}% auto 1fr;`
    }
    if (props.orientation === "vertical") {
        return `grid-template-rows: ${dividerPosition.value}% auto 1fr;`
    }
})

const dividerClass = computed(() => {
    if (props.orientation === "horizontal") {
        return `divider-f-horizontal`
    }
    if (props.orientation === "vertical") {
        return `divider-f-vertical`
    }
})

const { pressed } = useMousePressed({ target: divider })
const { x, y } = useMouse({target: gridPanel})

const dividerPosition = computed(() => {
    if (!pressed.value || _.isNil(gridPanel.value)) {
        return currentDividerPercentage.value
    }
    const div: HTMLDivElement = gridPanel.value as any as HTMLDivElement
    const rect = div.getBoundingClientRect()

    if (props.orientation === "horizontal") {
        computeCurrentDividerPercentageX(rect)
    }
    if (props.orientation === "vertical") {
        computeCurrentDividerPercentageY(rect)
    }
    return currentDividerPercentage.value
})

function setUpCurrentDividerPercentage(percentage: number) {
    if (percentage <= props.minmaxPercentage.min!) {
        currentDividerPercentage.value = props.minmaxPercentage.min!.toFixed(2)
        return
    }

    if (percentage >= props.minmaxPercentage.max!) {
        currentDividerPercentage.value = props.minmaxPercentage.max!.toFixed(2)
        return
    }

    currentDividerPercentage.value = percentage.toFixed(2)
}

function computeCurrentDividerPercentageX(rect: DOMRect) {
    const percentage = (x.value - rect.left) / rect.width * 100
    setUpCurrentDividerPercentage(percentage)
}

function computeCurrentDividerPercentageY(rect: DOMRect) {
    const percentage = y.value / rect.height * 100
    setUpCurrentDividerPercentage(percentage)
}


</script>

<style scoped>

.grid-panel {
    @apply grid gap-0
}

.panel1 {
    @apply overflow-hidden z-0
}

.panel2 {
    @apply z-10
}

.divider-f {
    @apply z-20 border-neutral
}

.divider-f-horizontal {
    @apply w-[3px] h-full border-r
}

.divider-f-vertical {
    @apply h-[3px] w-full border-b
}

.divider-f-horizontal:hover {
    cursor: col-resize;
}

.divider-f-vertical:hover {
    cursor: row-resize;
}

</style>