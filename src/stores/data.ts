import { ref, watch, type Ref } from 'vue'
import { defineStore } from 'pinia'
import file from '@/data.json'

interface Quote {
  Amount: number
  Currency: string
  Years: number
  CouponType: string
  Spread: number
  Yield: number | null
  '3MLSpread': number | null
}
interface Dataset {
  Items: Array<{
    Id: string | null
    DateSent: string | null
    Company: string
    Preferred: string
    Quote: Quote[] | null
  }>
}

export const useDataStore = defineStore('data', () => {
  const filterDataByCurrency = (currency: string) => {
    const filteredItems = file.Items.filter((item) => item.Quote).map((item) => ({
      ...item,
      Quote: item.Quote.filter((quote) => quote.Currency === currency)
    }))
    const itemsWithoutQuotes = file.Items.filter((item) => !item.Quote)
    return { Items: [...filteredItems, ...itemsWithoutQuotes] }
  }

  const getAvailableYears = (data: any[]) => {
    const years = new Set<number>()
    console.log(data)
    data.forEach((item) => {
      if (item.Quote) {
        item.Quote.forEach((quote) => {
          years.add(quote.Years)
        })
      }
    })

    console.log(Array.from(years))
    return Array.from(years)
  }

  const getAvailableCurrencies = (data: any[]) => {
    const currencies = new Set<string>()
    data.forEach((item) => {
      if (item.Quote) {
        item.Quote.forEach((quote) => {
          currencies.add(quote.Currency)
        })
      }
    })
    return Array.from(currencies)
  }

  const selectedCurrency: Ref<string> = ref('USD')
  const data = ref(filterDataByCurrency(selectedCurrency.value))
  const availableYears = ref(getAvailableYears(data.value.Items))
  const selectedYears: Ref<Array<number>> = ref(availableYears.value)
  const availableCurrencies = ref(getAvailableCurrencies(file.Items))

  const changeCurrency = (currency: string) => {
    selectedCurrency.value = currency
  }

  const changeSelectedYears = (years: number[]) => {
    selectedYears.value = years
  }

  watch(selectedCurrency, () => {
    data.value = filterDataByCurrency(selectedCurrency.value)
    availableYears.value = getAvailableYears(data.value.Items)
    selectedYears.value = availableYears.value
  })

  watch(selectedYears, () => {
    selectedYears.value = selectedYears.value.sort((a, b) => a - b)
  })

  return {
    data,
    changeSelectedYears,
    selectedCurrency,
    changeCurrency,
    availableCurrencies,
    availableYears,
    selectedYears,
  }
})
