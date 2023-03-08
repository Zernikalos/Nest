<template>
    <ResizablePanel>
        <template v-slot:panel1>

            <TreeView :items="treeViewItems"></TreeView>

        </template>
        <template v-slot:panel2>

        </template>
    </ResizablePanel>
</template>

<script setup>
import ResizablePanel from "@studio/components/resizablepanel/ResizablePanel.vue"
import TreeView from "@studio/components/treeview/TreeView.vue"

const treeViewItems = [
    {
        name: "sample1",
        icon: "bi-folder",
        children: [
            {
                name: "sample2"
            },
            {
                name: "sample3",
                icon: "bi-folder",
                children: [
                    {
                        name: "sample31"
                    }
                ]
            }
        ]
    }
]

</script>

<style scoped>

</style>
