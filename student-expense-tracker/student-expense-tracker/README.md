# PocketPal — Student Expense Tracker

PocketPal is a beginner-friendly expense tracking website made with HTML, CSS, and vanilla JavaScript. It helps students record expenses, set a monthly budget, and understand their spending.

## Features

- Add an expense with a description, amount, category, and date
- Set and update a monthly budget
- See this month's total spending, remaining budget, and transaction count
- Filter expenses by category
- Delete one expense or clear all expenses
- Save expenses in browser LocalStorage, so they remain after refreshing
- Responsive layout for desktop and mobile screens

## Tech stack

- HTML5
- CSS3
- JavaScript
- Browser LocalStorage

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a web browser.
3. Add an expense and try changing the budget.

No installation or server is required.

## Project structure

```text
student-expense-tracker/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How it works

- `index.html` contains the page structure and form.
- `style.css` controls the layout, colors, and responsive design.
- `script.js` validates input, updates totals, filters and deletes transactions, and stores data using LocalStorage.

## Important note

Data is stored only in the current browser on the current device. It is not synced to an account or shared across browsers.

## Future improvements

- Add monthly charts
- Export transactions to CSV
- Add recurring expenses
- Add user accounts and cloud storage

## Author

Created as a first web development and GitHub portfolio project.
