<template>
  <q-page class="flex">
      <q-splitter class="col" v-model="splitterPercentage" emit-immediately unit="%" :limits="[0, 100]">
        <template v-slot:before>
            <div class="column full-height">
                <q-scroll-area class="column full-height">
                    <q-tree
                        selected-color="primary"
                        node-key="id"
                        label-key="name"
                        children-key="children"
                        :selected="studioStore.obj"
                        @update:selected="handleSelection"
                        :nodes="treeNodes"
                    />
                </q-scroll-area>
            </div>
        </template>

        <template v-slot:after>
            <div class="column full-height">
                <q-scroll-area class="q-pa-md column full-height">
<!--                    <div class="q-pa-md">-->
<!--                        <div class="text-h4 q-mb-md">Before</div>-->
<!--                        <div v-for="n in 20" :key="n" class="q-my-md">{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</div>-->
<!--                    </div>-->
                    <FormZObject></FormZObject>
                </q-scroll-area>
            </div>

        </template>
      </q-splitter>
  </q-page>
</template>

<script setup lang="ts">
import {computed, ref} from "vue"
import {ZObject} from "@zernikalos/zkbuilder"
import _ from "lodash"
import FormZObject from "components/forms/FormZObject.vue"
import {useStudioStore} from "stores/studio-store"

const splitterPercentage = ref(20)

const studioStore = useStudioStore()

const treeNodes = computed(() => {
    if (_.isNil(studioStore.root)) {
        return []
    }
    studioStore.select(studioStore.root as ZObject)
    return [studioStore.root]
})

function handleSelection(id) {
    studioStore.selectById(id)
}

</script>

<style scoped>

</style>
