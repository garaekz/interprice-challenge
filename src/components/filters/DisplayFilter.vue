<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';

const store = useDataStore();
const { availableFields, selectedField } = storeToRefs(store)
</script>
<template>
  <div class="flex">
    <button 
    v-for="(field, index) in availableFields" 
    @click="selectedField = field"
    :key="field" :class="{
        'rounded-l border-l': field === availableFields[0],
        'rounded-r': field === availableFields[availableFields.length - 1],
        'border-l-0': index !== 0,
        'bg-cyan-700 text-white': field === selectedField,
        'bg-transparent text-cyan-700 border-r border-y border-cyan-700 hover:bg-cyan-700 hover:text-white': field !== selectedField,
      }" class="py-2 px-4 h-10">
      {{ field }}
    </button>
  </div>
</template>