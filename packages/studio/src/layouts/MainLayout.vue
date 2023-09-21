<template>
    <div class="flex flex-col h-screen">
        <Navbar class="h-[5%] min-h-12 max-h-12"></Navbar>
        <div class="flex h-[96%]">
            <Sidebar class="w-14"></Sidebar>
            <div class="wrapper h-full">
                <RouterView id="router-view"/>
            </div>
        </div>
    </div>
    <div v-if="showModal">
        <ImportFileModal v-model:open="showModal">
        </ImportFileModal>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue"

import {RouterView} from "vue-router"
import Navbar from "@studio/components/Navbar.vue"
import Sidebar from "@studio/components/sidebar/Sidebar.vue"
import {useNativeStudio} from "@zernikalos/store"
import ImportFileModal from "@studio/views/ImportFileModal.vue";

const nativeStudio = useNativeStudio()

const showModal = ref(false)

nativeStudio.handleShowImport(() => showModal.value = true)

</script>

<style scoped>
.wrapper {
    width: calc(theme(width.full) - theme(width.14));
}

</style>