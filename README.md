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
- `yarn deploy`: builds and publishes `dist` to GitHub Pages

## Deploy to GitHub Pages

### 1) Make sure your repository is on GitHub

Push your project to a GitHub repository (for example: `https://github.com/<username>/forkify`).

### 2) Run deploy

```bash
yarn deploy
```

This command runs the production build and publishes the `dist` folder to the `gh-pages` branch.

### 3) Enable GitHub Pages

In your GitHub repository:

1. Go to **Settings** -> **Pages**.
2. In **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Select branch **gh-pages** and folder **/(root)**.
4. Save.

Your production URL will be:

`https://<username>.github.io/<repository-name>/`

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
