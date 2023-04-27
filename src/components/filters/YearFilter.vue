<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';

const store = useDataStore();
const { availableYears, selectedYears  } = storeToRefs(store);

const filters = ref<number[]>([]);
</script>
<template>
  <div class="flex">
    <ul
      class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      <li 
        v-for="(year) in availableYears"
        :key="year"
        class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
        <div class="flex items-center pl-3">
          <input 
            id="vue-checkbox-list" 
            type="checkbox" 
            :value="year"
            v-model="selectedYears"
            :checked="selectedYears.includes(year)"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
          <label for="vue-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            {{ year }}
          </label>
        </div>
      </li>
  </ul>
</div></template>