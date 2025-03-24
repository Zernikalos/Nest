<template>
    <div
        ref="gridPanel"
        class="grid-panel h-full w-full overflow-hidden break-normal"
        :style="[gridClass]"
    >
        <div class="panel1">
            <slot name="panel1" />
        </div>

        <div
            ref="divider"
            class="divider-f"
            :class="[dividerClass]"
        />

        <div class="panel2">
            <slot name="panel2" />
        </div>
    </div>
</template>

<script setup lang="ts">

import {computed, ref, watch} from "vue"
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
const dividerPosition = ref(10)

const gridClass = computed(() => {
    switch (props.orientation) {
        case "horizontal":
            return `grid-template-columns: ${dividerPosition.value}% auto 1fr;`
        case "vertical":
            return `grid-template-rows: ${dividerPosition.value}% auto 1fr;`
    }
})

const dividerClass = computed(() => {
    switch (props.orientation) {
        case "horizontal":
            return "divider-f-horizontal"
        case "vertical":
            return "divider-f-vertical"
    }
})

const { pressed } = useMousePressed({ target: divider })
const { x, y } = useMouse({target: gridPanel})

watch([pressed, x, y, gridPanel], () => {
    if (!pressed.value || _.isNil(gridPanel.value)) {
        return
    }
    const div: HTMLDivElement = gridPanel.value as HTMLDivElement
    const rect = div.getBoundingClientRect()

    const percentage = props.orientation === "horizontal" ?
        (x.value - rect.left) / rect.width * 100 :
        y.value / rect.height * 100

    dividerPosition.value = _.clamp(
        percentage,
        props.minmaxPercentage.min!,
        props.minmaxPercentage.max!
    )
})

</script>

<style scoped>
@reference "@nestui/assets/main.css";

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