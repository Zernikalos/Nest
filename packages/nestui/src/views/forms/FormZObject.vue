<template>
    <div class="flex flex-col" v-if="explorerStore.selected">
        <div class="join join-horizontal">
            <label class="label join-item">
                <span class="label-text">ID</span>
            </label>
            <input class="input join-item grow" v-model="explorerStore.selected.id" disabled>
        </div>

        <div class="join join-horizontal">
            <label class="label join-item">
                <span class="label-text">Name</span>
            </label>
            <input class="input join-item grow" v-model="explorerStore.selected.name">
        </div>

        <div class="join join-horizontal">
            <label class="label join-item">
                <span class="label-text">Object type</span>
            </label>
            <DropDownSelector class="join-item grow" :options="ZObjectType.values().map((v: ZObjectType) => v.name)" :selected="explorerStore.selected.type.name" />
        </div>

<!--        <div class="collapse collapse-arrow bg-base rounded-none">-->
<!--            <input type="checkbox" />-->
<!--            <div class="collapse-title text-xl font-medium">-->
<!--                Transform-->
<!--            </div>-->
<!--            <div class="collapse-content bg-base">-->
<!--                <p>tabindex="0" attribute is necessary to make the div focusable</p>-->
<!--            </div>-->
<!--        </div>-->
        <Collapse title="Transform">
            Some content here
        </Collapse>
    </div>

<!--        <q-expansion-item-->
<!--            switch-toggle-side-->
<!--            expand-separator-->
<!--            label="Transform"-->
<!--        >-->
<!--            <FormZTransform v-model="studioStore.obj.transform"></FormZTransform>-->
<!--        </q-expansion-item>-->
<!--        <q-expansion-item-->
<!--            switch-toggle-side-->
<!--            expand-separator-->
<!--            v-if="studioStore.obj.type === 'Model'"-->
<!--            label="Shading"-->
<!--        >-->
<!--            <FormZShaderProgram></FormZShaderProgram>-->
<!--        </q-expansion-item>-->
</template>

<script setup lang="ts">
import {ZObject, ZObjectType} from "@zernikalos/zkbuilder"
import DropDownSelector from "../../components/dropdownselector/DropDownSelector.vue";
import {useExplorerStore} from "@zernikalos/store/src/explorerStore";
import Collapse from "@nestui/components/Collapse.vue";

const explorerStore = useExplorerStore()
</script>

<style scoped>

</style>
