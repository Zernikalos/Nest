<template>
<!--    <ul class="items-center w-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">-->
<!--        <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">-->
<!--            <div class="flex items-center pl-3">-->
<!--                <input id="horizontal-list-radio-license" type="radio" value="" name="list-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">-->
<!--                <label for="horizontal-list-radio-license" class="py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">JSON</label>-->
<!--            </div>-->
<!--        </li>-->
<!--        <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">-->
<!--            <div class="flex items-center pl-3">-->
<!--                <input id="horizontal-list-radio-id" type="radio" value="" name="list-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">-->
<!--                <label for="horizontal-list-radio-id" class="py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">Cbor Hex</label>-->
<!--            </div>-->
<!--        </li>-->
<!--        <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">-->
<!--            <div class="flex items-center pl-3">-->
<!--                <input id="horizontal-list-radio-millitary" type="radio" value="" name="list-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">-->
<!--                <label for="horizontal-list-radio-millitary" class="py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">Cbor</label>-->
<!--            </div>-->
<!--        </li>-->
<!--    </ul>-->

    <ul class="flex">
        <li class="">
            <div class="">
                <input id="json" type="radio" value="" v-model="picked" name="list-radio" class="" >
                <label for="json" class="">JSON</label>
            </div>
        </li>
        <li class="">
            <div class="">
                <input id="hexcbor" type="radio" value="" v-model="picked" name="list-radio" class="">
                <label for="hexcbor" class="">Cbor Hex</label>
            </div>
        </li>
        <li class="">
            <div class="">
                <input id="cbor" type="radio" value="" v-model="picked" name="list-radio" class="">
                <label for="cbor" class="">Cbor</label>
            </div>
        </li>
    </ul>
</template>

<script setup>
import {ref} from "vue";

const picked = ref()

</script>

<style scoped>

</style>
