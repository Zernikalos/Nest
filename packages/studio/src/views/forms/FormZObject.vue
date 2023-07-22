<template>
    <div class="flex flex-col" v-if="studioStore.obj">
        <label>ID</label>
        <input class="input" v-model="studioStore.obj.id" disabled>

        <label>Name</label>
        <input class="input" v-model="studioStore.obj.name">

        <DropDownSelector :options="Object.values(ZObjectType)" />
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
import {useStudioStore} from "@zernikalos/store"
import {ZObjectType} from "@zernikalos/zkbuilder"
import DropDownSelector from "../../components/dropdownselector/DropDownSelector.vue";

const studioStore = useStudioStore()

</script>

<style scoped>

</style>
