<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';

const store = useDataStore();
const { availableYears, selectedYears  } = storeToRefs(store);
</script>
<template>
  <div class="flex">
    <ul class="flex items-center">
      <li 
        v-for="(year, index) in availableYears"
        :key="year">
        <input 
            :id="`list-${year}`" 
            type="checkbox" 
            :value="year"
            v-model="selectedYears"
            :checked="selectedYears.includes(year)"
            class="hidden peer">
          <label 
            :for="`list-${year}`"
            :class="{
              'rounded-l border-l': year === availableYears[0],
              'rounded-r': year === availableYears[availableYears.length - 1],
              'border-l-0': index !== 0,
              'bg-cyan-700 text-white': selectedYears.includes(year),
              'bg-transparent text-cyan-700 border-r border-y border-cyan-700 hover:bg-cyan-700 hover:text-white': !selectedYears.includes(year),
            }"
            class="border-r border-y border-cyan-700 hover:bg-cyan-700 hover:text-white py-2 px-4 h-10 cursor-pointer uppercase">
            {{ year }} Yrs
          </label>
      </li>
  </ul>
  
</div></template>