# Solved Challenge For Interprice
Solution for the challenge proposed by [Interprice](https://gitlab.com/interprice/developer-test).
It was built using the initial template provided by [Vue CLI](https://cli.vuejs.org/), you can see my used stack [here](#tech-stack).

## Features

- [x] Currency switcher can dynamically toggle currencies returned from [data.json](src/data.json) (single currency at once, default is USD). Please notice that the set of currencies is not fixed and depends on the data from data.json
- [x] Years switcher can dynamically toggle the years (from data.json) calculated for selected currency (multi-selection is possible, defaults - all years for the currency are selected). The set of years depends on currency.
- [x] Table data also depends on the display parameter (like Spread, Yield and 3MLSpread). Only one can be selected at once
- [x] Table rows can be dynamically filtered by company name
- [x] Table rows are sorted by Date sent field by default, then by Preferred flag.
- [x] Rows with empty Quote field should be displayed below the rows with non-empty Quote fields.
- [x] Each row by default should display value from the field defined by display switcher (ie Spread, Yield or 3MLSpread).
- [x] Each row has dropdown control icon, which expands / collapses secondary rows for current row (by click). 
- [x]  These sub-rows should display values from the fields, which were not selected by display switcher. For instance, if Spread is selected, then secondary rows should contain Yield and 3MLSpread values.
- [x] Table rows can be sorted by Date Sent or Company Name columns.
- [x] Last row should contain average values (by years) for selected display parameter.
- [x] Minimal values (by column) of each primary row should be highlighted.

## Tech Stack

- [Vue.js](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Project Setup

```sh
npm install
```
### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
