import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/* estado global do aplicativo
    * - objeto de pesquisa
    * - objeto de receita atual
    * - objeto da lista de compras
    * - receitas favoritas
*/
const state = {};

/*
    SEARCH CONTROLLER
*/
const controlSearch = async () => {
    // 1) Obter consulta da vista
    const query = searchView.getInput();

    if (query) {
        // 2) Novo objeto de pesquisa e adicionar ao estado
        state.search = new Search(query);

        // 3) Prepare a interface do usuário para resultados
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);

        try {
            // 4) Procure por receitas
            await state.search.getResultado();

            // 5) Renderizar resultados na interface do usuário
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            console.log(error);
            alert('Algo errado com a pesquisa...');
            clearLoader();
        }
    };
};

elements.searchForm.addEventListener(`submit`, e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener(`click`, e => {
    const btn = e.target.closest(`.btn-inline`);
    
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/*
    RECIPE CONTROLLER
*/
const controlRecipe = async () => {
    // Obter ID do URL
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare a UI para alterações
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Destaque o item de pesquisa selecionado
        if (state.search) searchView.highlightSelected(id);

        // Criar novo objeto de receita
        state.recipe = new Recipe(id);

        try {
            // Criar novo objeto de receita e analisar ingredientes
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calcule tempo e serviço
            state.recipe.calcTime();
            state.recipe.calcServImgs();

            // Render receita
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } catch (error) {
            console.log(error);
            alert('Erro ao processar receita!');
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/*
    LIST CONTROLLER
*/
const controlList = () => {
    // Crie uma nova lista se ainda não houver
    if (!state.list) state.list = new List();

    // Adicione cada ingrediente à lista e UI 
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

// Manipular eventos de excluir e atualizar itens de lista
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Manipule o botão excluir
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {

        // Excluir do estado
        state.list.deleteItem(id);

        // Excluir da UI
        listView.deleteItem(id);

    // Lidar com a atualização da contagem
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

/*
    LIKE CONTROLLER
*/
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // O usuário ainda não gostou da receita atual
    if (!state.likes.isLiked(currentID)) {

        // Adicione like ao estado
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Alterne o botão Curtir
        likesView.toggleLikeBtn(true);

        // Adicionar like à lista de UI
        likesView.renderLike(newLike);
    
    // O usuário gostou da receita atual
    } else {
        // Remover like do estado
        state.likes.deleteLike(currentID);

        // Alterne o botão Curtir
        likesView.toggleLikeBtn(false);

        // Remover like da lista de UI
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Retornar receitas curtidas no carregamento da página
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Retornar curtidas
    state.likes.readStorage();

    // Alternar como botão de menu
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Renderizar as curtidas existentes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Manipulação de cliques no botão de receita
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // O botão Diminuir é clicado
        if (state.recipe.servImgs > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // O botão Aumentar é clicado
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Adicionar ingredientes à lista de compras
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controlador
        controlLike();
    }
});
