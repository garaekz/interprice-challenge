<script setup lang="ts">
import CurrencyFilter from './filters/CurrencyFilter.vue';
import YearFilter from './filters/YearFilter.vue';
import DisplayFilter from './filters/DisplayFilter.vue';
</script>
<template>
  <div class="flex flex-col py-4 md:flex-row gap-4">
    <CurrencyFilter />
    <YearFilter />
    <DisplayFilter />
  </div>
</template>