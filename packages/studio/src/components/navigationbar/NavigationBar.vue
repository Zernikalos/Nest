<template>
    <q-list class="column full-height" padding>
        <NavigationBarItem icon="bi-journal-code" tooltip="Studio" route-dest="/studio" route-name="studio" />
        <NavigationBarItem icon="bi-file-earmark-arrow-down" tooltip="Import from file" route-dest="/import" route-name="import" />
        <NavigationBarItem icon="bi-hammer" tooltip="Bundle" route-dest="/bundle" route-name="bundle" />
        <NavigationBarItem class="margin-top" icon="bi-gear" tooltip="Settings" route-dest="/settings" route-name="settings" />
        <!--    <q-separator />-->
    </q-list>
</template>

<script setup lang="ts">
import NavigationBarItem from "components/navigationbar/NavigationBarItem.vue"

</script>

<style scoped>
.margin-top {
    margin-top: auto;
}
</style>
