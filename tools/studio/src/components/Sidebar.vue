<template>
    <div class="shadow-md bg-gray-900 px-1 border-r border-opacity-40 border-gray-400">
        <ul class="relative">
            <li>
                <RouterLink class="sidebar-item" to="/studio">Studio</RouterLink>
            </li>
            <li>
                <RouterLink class="sidebar-item" to="/exporter">Export files</RouterLink>
            </li>
        </ul>
    </div>
</template>

<script setup>

</script>

<style scoped lang="postcss">
.sidebar-item {
    @apply flex items-center text-sm py-4 px-6 h-12 overflow-hidden  text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out
}
</style>
