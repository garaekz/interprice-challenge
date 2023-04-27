<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import TableFilters from '@/components/TableFilters.vue';
import * as dayjs from 'dayjs'
import * as customParseFormat from 'dayjs/plugin/customParseFormat'

const store = useDataStore();

const { data, selectedYears } = storeToRefs(store);

const dateFilter = (date: string | null) => {
  if (!date) return '';
  dayjs.extend(customParseFormat);
  return dayjs(date, 'YYYY-MM-DD').format('DD-MMM-YY');
};

const findQuote = (quotes: any[], year: number, type: string) => {
  return quotes.find((quote) => quote.Years === year && quote.CouponType === type.toUpperCase())
};
</script>

<template>
  <main class="w-full h-full min-h-screen flex justify-center">
    <div class="w-full max-w-7xl mx-auto mt-10">
      <TableFilters />
      <table class="w-full">
        <thead class="uppercase">
          <tr>
            <th colspan="2"></th>
            <th v-for="year in selectedYears" :key="year" colspan="2" class="whitespace-nowrap px-2">
              <div class="w-full font-bold border-b border-black">
                {{ year }} Yrs
              </div>
            </th>
          </tr>
          <tr class="border-b border-black text-left">
            <th class="font-thin text-gray-500">Date Sent</th>
            <th class="font-thin text-gray-500">Company</th>
            <template v-for="year in selectedYears" :key="year">
              <th class="font-thin text-gray-500 px-4">
                Fix
              </th>
              <th class="font-thin text-gray-500">
                Frn
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in data.Items" :key="item.Id">
            <tr class="border-b border-gray-200">
              <td class="whitespace-nowrap px-3">
                {{ dateFilter(item.DateSent) }}
              </td>
              <td
                :class="{
                  'text-gray-400': !item.Quote,
                }" 
                class="font-bold">
                {{ item.Company }}
              </td>
              <template v-for="year in selectedYears" :key="year">
                <td class="font-thin text-gray-500 px-4">
                  {{ item.Quote ? findQuote(item.Quote, year, 'fix') : '' }}
                </td>
                <td class="font-thin text-gray-500">
                  {{ item.Quote ? findQuote(item.Quote, year, 'frn') : '' }}
                </td>
              </template>
            </tr>
            <tr v-for="quote in item.Quote" :key="quote.Id">
              <td></td>
              <td></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <pre>
      {{ data }}
    </pre>
  </main>
</template>
