<script setup lang="ts">
import { ref } from 'vue';
import type { Item, Field, BondType } from '@/types';
import TableFilters from '@/components/TableFilters.vue';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const store = useDataStore();

const { availableFields, search, selectedCurrency, selectedYears, selectedField, sortColumn, sortOrder, filteredData } = storeToRefs(store);
const { getMinValues, formatValueByDisplay, getAverageValue, toggleColumnSort } = store;

const dateFilter = (date: string | null) => {
  if (!date) return '';
  dayjs.extend(customParseFormat);
  return dayjs(date, 'YYYY-MM-DD').format('DD-MMM-YY');
};

const expandedRows = ref<string[]>([]);
const toggleExpandedRows = (row: string) => {
  if (expandedRows.value.includes(row)) {
    expandedRows.value = expandedRows.value.filter((r) => r !== row);
  } else {
    expandedRows.value = [...expandedRows.value, row];
  }
};

const isMinValue = (
    items: Item[],
    item: Item,
    currency: string,
    year: number,
    bondType: BondType,
    field: Field
  ): boolean => {
    const minValues = getMinValues(items, currency, year, field, bondType);
    const value = item.Quote?.[currency]?.[year]?.[bondType]?.[field] ?? 0;
    return value === minValues;
  };
</script>

<template>
  <main class="w-full flex flex-col justify-center">
    <div class="w-full max-w-7xl mt-20 mx-auto px-4">
      <TableFilters />
      <div class="w-1/3 my-4">
        <input 
          class="w-full border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          type="text" v-model="search" placeholder="Filter by company name...">
      </div>
      <table class="w-full">
        <thead class="uppercase">
          <tr>
            <th class="w-8"></th>
            <th colspan="2"></th>
            <th v-for="year in selectedYears" :key="year" colspan="2" class="whitespace-nowrap pl-3">
              <div class="w-full font-bold border-b border-gray-600">
                {{ year }} Yrs
              </div>
            </th>
          </tr>
          <tr class="border-b border-gray-600 text-left">
            <th class="w-8"></th>
            <th class="font-thin text-gray-500">
              <button
                @click="toggleColumnSort('DateSent')"
                class="flex gap-2 items-center uppercase whitespace-nowrap">
                Date Sent
                <span
                  :class="
                    {
                      'text-black': sortColumn === 'DateSent',
                      'text-gray-400': sortColumn !== 'DateSent',
                    }
                  " 
                  class="w-3">
                  <svg 
                    v-if="sortColumn === 'DateSent' && sortOrder === 'desc'"
                    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 320 512"><path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z" fill="currentColor"></path></svg>
                    <svg 
                      v-else
                      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 320 512"><path d="M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z" fill="currentColor"></path></svg>
                  </span>
              </button>
            </th>
            <th class="font-thin text-gray-500">
              <button
                @click="toggleColumnSort('Company')"
                class="flex gap-2 items-center uppercase">
                Company
                <span
                  :class="
                    {
                      'text-black': sortColumn === 'Company',
                      'text-gray-400': sortColumn !== 'Company',
                    }
                  " 
                  class="w-3">
                  <svg 
                    v-if="sortColumn === 'Company' && sortOrder === 'asc'"
                    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 320 512"><path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z" fill="currentColor"></path></svg>
                    <svg 
                      v-else
                      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 320 512"><path d="M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z" fill="currentColor"></path></svg>
                  </span>
              </button>
            </th>
            <template v-for="year in selectedYears" :key="year">
              <th class="font-thin text-gray-500 text-center">
                Fix
              </th>
              <th class="font-thin text-gray-500 text-center">
                Frn
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in filteredData" :key="item.Id">
            <tr
              class="border-t border-gray-200">
              <td class="w-8">
                <button 
                  v-if="item.Id && item.Quote"
                  @click="toggleExpandedRows(item.Id!)"
                  class="w-6 flex items-center">
                  <svg 
                    v-if="expandedRows.includes(item.Id!)"
                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clip-rule="evenodd" fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"></path>
                  </svg>
                  <svg 
                    v-else
                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clip-rule="evenodd" fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"></path>
                  </svg>
                </button>
              </td>
              <td class="whitespace-nowrap">
                {{ dateFilter(item.DateSent) }}
              </td>
              <td
                :class="{
                  'text-gray-300': !item.Quote,
                }" 

                class="font-bold py-1.5">
                {{ item.Company }}
              </td>
              <template v-for="year in selectedYears" :key="year">
                <td 
                  :class="{
                    'bg-orange-100/70': isMinValue(filteredData, item, selectedCurrency, year, 'FIX' as BondType, selectedField),
                  }"
                  class="font-thin text-gray-800 text-center w-20">
                  {{ formatValueByDisplay(selectedField, item.Quote?.[selectedCurrency]?.[year]?.['FIX']?.[selectedField]) }}
                </td>
                <!-- The image didn't showed higlited Frn col, don't know if I need to add it -->
                <td class="font-thin text-gray-800 text-center w-20">
                  {{ formatValueByDisplay(selectedField, item.Quote?.[selectedCurrency]?.[year]?.['FRN']?.[selectedField]) }}
                </td>
              </template>
            </tr>
            <template v-for="field in availableFields" :key="field" >
              <tr
                class="border-t border-gray-200" v-if="(field !== selectedField) && expandedRows.includes(item.Id!)">
                <td></td>
                <td></td>
                <td class="font-thin text-gray-800 py-1.5">
                  {{ field }}
                </td>
                <template v-for="year in selectedYears" :key="year">
                  <td
                    class="font-thin text-gray-800 text-center w-20">
                    {{ formatValueByDisplay(field, item.Quote?.[selectedCurrency]?.[year]?.['FIX']?.[field]) }}
                  </td>
                  <td class="font-thin text-gray-800 text-center w-20">
                    {{ formatValueByDisplay(field, item.Quote?.[selectedCurrency]?.[year]?.['FRN']?.[field]) }}
                  </td>
                </template>
              </tr>
            </template>
          </template>
        </tbody>
        <tfoot>
          <tr class="border border-gray-600">
            <td></td>
            <td></td>
            <td class="py-2">
              Average by {{ selectedField }}
            </td>
            <template v-for="year in selectedYears" :key="year">
              <td class="text-center w-20">
                {{ getAverageValue(filteredData, selectedCurrency, year, 'FIX', selectedField) }}
              </td>
              <td class="text-center w-20">
                {{ getAverageValue(filteredData, selectedCurrency, year, 'FRN', selectedField) }}
              </td>
            </template>
          </tr>
        </tfoot>
      </table>
    </div>
  </main>
</template>
