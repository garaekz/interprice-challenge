<script setup lang="ts">
import CurrencyFilter from './filters/CurrencyFilter.vue';
import YearFilter from './filters/YearFilter.vue';

</script>
<template>
  <div class="flex gap-4">
    <CurrencyFilter />
    <YearFilter />
  </div>
</template>