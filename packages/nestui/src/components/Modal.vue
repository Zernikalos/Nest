<template>
    <!--    <button class="btn" onclick="my_modal_1.showModal()">open modal</button>-->
    <dialog
        :id="props.id"
        class="modal"
        :class="{'modal-open': isOpen}"
    >
        <div class="modal-box">
            <form method="dialog">
                <span
                    v-if="props.title"
                    class="text-2xl font-bold"
                >
                    {{ props.title }}
                </span>
                <button
                    class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    @click="isOpen = false"
                >
                    ✕
                </button>
            </form>
            <slot />
        </div>
    </dialog>
</template>

<script setup lang="ts">
import {useVModel} from "@vueuse/core"

const props = defineProps<{
    id: string
    title?: string
    open: boolean
}>()

const emit = defineEmits(["update:open"])

const isOpen = useVModel(props, "open", emit)

</script>

<style scoped>

</style>