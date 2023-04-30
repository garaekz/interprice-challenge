import { ref, watch, type Ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Company, FormattedQuote, Quote } from '@/types'
import file from '@/data.json'

const sortItemsByColumn = (items: any[], column: string, direction: string): any[] => {
  const primarySort = (a: any, b: any) => {
    if (a[column] < b[column]) {
      return direction === 'asc' ? -1 : 1;
    }
    if (a[column] > b[column]) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  };

  const secondarySort = (a: any, b: any) => {
    if (a.Preferred < b.Preferred) {
      return 1;
    }
    if (a.Preferred > b.Preferred) {
      return -1;
    }
    return 0;
  };

  return items.sort((a, b) => {
    const primarySortResult = primarySort(a, b);
    if (primarySortResult === 0) {
      return secondarySort(a, b);
    }
    return primarySortResult;
  });
}

const sortData = (data: Company[], column: string, order: string): Company[] => {
  const sorted = sortItemsByColumn(data.filter((item: Company) => item.Quote), column, order);
  const sortedNoQuotes = sortItemsByColumn(data.filter((item: Company) => !item.Quote), column, order);
  return [...sorted, ...sortedNoQuotes];
};

export const useDataStore = defineStore('data', () => {
  const items = file.Items;
  const transformData = (json: any, sortColumn: string = 'DateSent', sortOrder: string = 'desc'): Company[] => {
    const companies = json.Items.map((item: any) => {
      const quote: FormattedQuote = {};
      item.Quote && item.Quote.forEach((q: Quote) => {
        // We create a reusable structure to get years by currency
        if (!years.value[q.Currency]) {
          years.value[q.Currency] = [];
        }

        if (!years.value[q.Currency].includes(q.Years)) {
          years.value[q.Currency].push(q.Years);
        }

        // We create a reusable structure to get quotes by the filter criteria we need
        if (!quote[q.Currency]) {
          quote[q.Currency] = {};
        }

        if (!quote[q.Currency][q.Years]) {
          quote[q.Currency][q.Years] = {};
        }
        
        if (!quote[q.Currency][q.Years][q.CouponType]) {
          quote[q.Currency][q.Years][q.CouponType] = {} as Quote;
        }

        quote[q.Currency][q.Years][q.CouponType] = q;
      });
  
      return {
        Id: item.Id || null,
        DateSent: item.DateSent || null,
        Company: item.Company,
        Preferred: item.Preferred,
        Quote: Object.keys(quote).length === 0 ? null : quote,
      };
    });

    return sortData(companies, sortColumn, sortOrder);
  };

  // Initial values
  const currencies = [...new Set(items.map(item => item.Quote?.map(q => q.Currency)).flat())].filter(Boolean);
  const years: Ref<{[key: string]: number[]}> = ref({});
  const selectedCurrency: Ref<string> = ref('USD')
  const transformedData = ref(transformData(file));
  const sortColumn: Ref<'DateSent'|'Company'>  = ref('DateSent')
  const sortOrder: Ref<'asc'|'desc'> = ref('desc')
  const availableYears: Ref<number[]> = ref(years.value[selectedCurrency.value])
  const selectedYears: Ref<number[]> = ref(availableYears.value)
  const availableCurrencies: Ref<(string | undefined)[]> = ref(currencies)
  const availableFields: Ref<string[]> = ref(['Spread', 'Yield', '3MLSpread'])
  const selectedField: Ref<string> = ref('Spread')

  const toggleColumnSort = (column: "DateSent" | "Company") => {
    if (sortColumn.value === column) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn.value = column;
      column === 'DateSent' ? sortOrder.value = 'desc' : sortOrder.value = 'asc';
    }
  };

  // Watchers
  watch(selectedCurrency, () => {
    selectedYears.value = availableYears.value = years.value[selectedCurrency.value]
  })

  watch(sortColumn, (newValue) => {
    transformedData.value = sortData(transformedData.value, newValue, sortOrder.value)
  })

  watch(sortOrder, (newValue) => {
    transformedData.value = sortData(transformedData.value, sortColumn.value, newValue)
  })

  // Make sure the years are always sorted
  watch(selectedYears, () => {
    selectedYears.value = selectedYears.value.sort((a, b) => a - b)
  })

  return {
    selectedCurrency,
    availableCurrencies,
    availableYears,
    selectedYears,
    availableFields,
    selectedField,
    sortColumn,
    sortOrder,
    toggleColumnSort,
    transformedData,
    years,
  }
})
