# Forkify

A web app to search recipes, view details, adjust servings, build a shopping list, and save favorite recipes.

## Overview

This project consumes the public Forkify API and organizes the interface into model and view modules.
The global app state controls four main parts:

- Recipe search
- Currently selected recipe
- Shopping list
- Liked recipes (persisted in the browser)

## Features

- Search recipes by keyword
- Paginate search results
- Open recipe details through URL hash
- Adjust servings and recalculate ingredients
- Add ingredients to the shopping list
- Edit quantities and remove shopping list items
- Like/unlike recipes
- Persist likes with localStorage

## Technologies

- JavaScript (ES6+)
- Webpack 5
- Babel
- Axios
- HTML/CSS

## Project Structure

```text
src/
 index.html
 js/
  index.js              # controllers and global state
  config.js             # configuration (key/API)
  models/
   Search.js           # recipe search
   Recipe.js           # recipe details, ingredient parser, servings
   List.js             # shopping list
   likes.js            # likes and local persistence
  views/
   base.js             # UI selectors and helper functions
   searchView.js       # search/pagination rendering
   recipeView.js       # recipe rendering and updates
   listView.js         # shopping list rendering
   likesView.js        # likes rendering
```

## Running Locally

### 1) Install dependencies

```bash
yarn install
```

### 2) Start development environment

```bash
yarn start
```

The command above runs `webpack-dev-server` and opens the app in your browser.

## Scripts

- `yarn start`: starts the development server
- `yarn dev`: builds bundle in development mode
- `yarn build`: builds bundle in production mode

## App Flow

1. User searches for a recipe.
2. Search calls the API and renders paginated results.
3. When a result is selected, the recipe is loaded via URL hash.
4. User can adjust servings, send ingredients to the list, and like recipes.
5. Likes are restored automatically when the page reloads.

## Notes

- The project uses the Forkify API hosted on Heroku.
- If the API is unavailable, some features may fail temporarily.
- Likes are stored only in the current browser.
- This project uses Yarn as the package manager.
