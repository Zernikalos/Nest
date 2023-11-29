<template>
    <div class="bg-base-100 common-panel">
        <TreeView :items="treeViewItems" @selected="handleSelected"></TreeView>
    </div>

</template>

<script setup lang="ts">

import TreeView from "@studio/components/treeview/TreeView.vue";
</script>

<style scoped>

</style>