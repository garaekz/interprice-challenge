<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';

const store = useDataStore();
const { availableCurrencies, selectedCurrency } = storeToRefs(store)
const { changeCurrency } = store;
</script>
<template>
  <div class="flex">
    <button 
      @click="changeCurrency(currency)"
      v-for="(currency, index) in availableCurrencies" :key="currency" :class="{
        'rounded-l border-l': currency === availableCurrencies[0],
        'rounded-r': currency === availableCurrencies[availableCurrencies.length - 1],
        'border-l-0': index !== 0,
        'border-r-0': index !== availableCurrencies.length - 1,
        'bg-cyan-700 text-white': currency === selectedCurrency,
        'bg-transparent text-cyan-700 border-r border-y border-cyan-700 hover:bg-cyan-700 hover:text-white': currency !== selectedCurrency,
      }" class="py-2 px-4">
      {{ currency }}
    </button>
  </div>
</template>