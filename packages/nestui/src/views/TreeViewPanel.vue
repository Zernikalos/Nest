<template>
    <div class="bg-base-100 panel1">
        <TreeView :items="treeViewItems" @selected="handleSelected"></TreeView>
    </div>

</template>

<script setup lang="ts">

import TreeView from "@nestui/components/treeview/TreeView.vue";
</script>

<style scoped>

</style>