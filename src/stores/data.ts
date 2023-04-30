import { ref, watch, type Ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Item, FormattedQuote, Quote, Field, BondType, MinValue } from '@/types'
import file from '@/data.json'

const sortItemsByColumn = (items: any[], column: string, direction: string): any[] => {
  const primarySort = (a: any, b: any) => {
    if (a[column] < b[column]) {
      return direction === 'asc' ? -1 : 1
    }
    if (a[column] > b[column]) {
      return direction === 'asc' ? 1 : -1
    }
    return 0
  }

  const secondarySort = (a: any, b: any) => {
    if (a.Preferred < b.Preferred) {
      return 1
    }
    if (a.Preferred > b.Preferred) {
      return -1
    }
    return 0
  }

  return items.sort((a, b) => {
    const primarySortResult = primarySort(a, b)
    if (primarySortResult === 0) {
      return secondarySort(a, b)
    }
    return primarySortResult
  })
}

const sortData = (data: Item[], column: string, order: string): Item[] => {
  const sorted = sortItemsByColumn(
    data.filter((item: Item) => item.Quote),
    column,
    order
  )
  const sortedNoQuotes = sortItemsByColumn(
    data.filter((item: Item) => !item.Quote),
    column,
    order
  )
  return [...sorted, ...sortedNoQuotes]
}

const searchFilter = (item: Item, search?: string) => {
  if (!search) return true
  return item.Company.toLowerCase().includes(search.toLowerCase())
}

export const useDataStore = defineStore('data', () => {
  const items = file.Items

  const transformData = (json: any, sortColumn = 'DateSent', sortOrder = 'desc', search?: string): Item[] => {
    const companies = json.Items.map((item: any) => {
      if (!searchFilter(item, search)) return null
      const quote: FormattedQuote = {}

      item.Quote?.forEach((q: Quote) => {
        if (!years.value[q.Currency]) {
          years.value[q.Currency] = []
        }

        if (!years.value[q.Currency].includes(q.Years)) {
          years.value[q.Currency].push(q.Years)
        }

        const currencyQuotes = quote[q.Currency] || (quote[q.Currency] = {})
        const yearQuotes = currencyQuotes[q.Years] || (currencyQuotes[q.Years] = {})
        yearQuotes[q.CouponType] = q
      })

      return {
        Id: item.Id || null,
        DateSent: item.DateSent || null,
        Company: item.Company,
        Preferred: item.Preferred,
        Quote: Object.keys(quote).length === 0 ? null : quote
      }
    }).filter(Boolean)

    console.log(companies)

    return sortData(companies, sortColumn, sortOrder)
  }

  // Initial values
  const currencies = [
    ...new Set(items.map((item) => item.Quote?.map((q) => q.Currency)).flat())
  ].filter(Boolean)
  const search = ref('')
  const years: Ref<{ [key: string]: number[] }> = ref({})
  const selectedCurrency: Ref<string> = ref('USD')
  const transformedData = ref(transformData(file))
  const filteredData = ref(transformedData.value)
  const sortColumn: Ref<'DateSent' | 'Company'> = ref('DateSent')
  const sortOrder: Ref<'asc' | 'desc'> = ref('desc')
  const availableYears: Ref<number[]> = ref(years.value[selectedCurrency.value])
  const selectedYears: Ref<number[]> = ref(availableYears.value)
  const availableCurrencies: Ref<(string | undefined)[]> = ref(currencies)
  const availableFields: Ref<string[]> = ref(['Spread', 'Yield', '3MLSpread'])
  const selectedField: Ref<Field> = ref('Spread')

  const toggleColumnSort = (column: 'DateSent' | 'Company') => {
    if (sortColumn.value === column) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortColumn.value = column
      column === 'DateSent' ? (sortOrder.value = 'desc') : (sortOrder.value = 'asc')
    }
  }

  const formatValueByDisplay = (field: string, value?: number): string => {
    if (!value) return ''
    if (field === 'Yield') return `${value.toFixed(3)}%`
    if (field === '3MLSpread' || field === 'Spread')
      return `${+value > 0 ? '+' : ''}${Math.round(value)}bp`
    return `${value}`
  }

  const getAverageValue = (
    data: Item[],
    currency: string,
    years: number,
    bondType: string,
    valueType: string
  ): string => {
    const matchingItems = data.filter(
      (item) =>
        item &&
        item.Quote?.[currency]?.[years]?.[bondType]?.[valueType] !== undefined &&
        item.Quote[currency][years][bondType][valueType] !== null
    )

    if (matchingItems.length === 0) {
      return ''
    }

    const sum = matchingItems.reduce(
      (acc, item) => acc + item.Quote?.[currency][years][bondType][valueType],
      0
    )
    const count = matchingItems.length

    return formatValueByDisplay(valueType, sum / count)
  }

  // Watchers
  watch(selectedCurrency, () => {
    selectedYears.value = availableYears.value = years.value[selectedCurrency.value]
  })

  watch(sortColumn, (newValue) => {
    filteredData.value = sortData(filteredData.value, newValue, sortOrder.value)
  })

  watch(sortOrder, (newValue) => {
    filteredData.value = sortData(filteredData.value, sortColumn.value, newValue)
  })

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const DEBOUNCE_TIME = 500;
  watch(search, (newValue) => {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      filteredData.value = transformData(file, sortColumn.value, sortOrder.value, newValue);
    }, DEBOUNCE_TIME);
  })

  // Make sure the years are always sorted
  watch(selectedYears, () => {
    selectedYears.value = selectedYears.value.sort((a, b) => a - b)
  })

  const getMinValues = (
    items: Item[],
    currency: string,
    year: number,
    field: Field,
    bondType: BondType
  ): number => {
    const minValues: { [key: string]: number } = {}

    items.forEach((item) => {
      if (item.Quote?.[currency]?.[year]?.[bondType]?.[field]) {
        let value = item.Quote?.[currency]?.[year]?.[bondType]?.[field]
        if (!value) value = 0
        const key = `${currency}_${year}_${field}_${bondType}`

        if (minValues[key] === undefined || value < minValues[key]) {
          minValues[key] = value
        }
      }
    })

    return Object.values(minValues).sort((a, b) => a - b)[0]
  }

  return {
    availableCurrencies,
    availableFields,
    availableYears,
    formatValueByDisplay,
    getAverageValue,
    getMinValues,
    search,
    selectedCurrency,
    selectedField,
    selectedYears,
    sortColumn,
    sortOrder,
    toggleColumnSort,
    filteredData,
    years
  }
})
