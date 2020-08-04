import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('Algo deu errado :(');
        }
    }

    calcTime() {
        // Assumindo que precisamos de 15 min para cada 3 ingredientes
        const numImg = this.ingredients.length;
        const periods = Math.ceil(numImg / 3);
        this.time = periods * 15;
    }

    calcServImgs() {
        this.servImgs = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            // 1) Unidades Uniformes
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) Remova os parênteses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Analise os ingredientes em contagem, unidade e ingrediente
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // Existe uma unidade
                // Ex. 4 1/2 xícaras, arrCount é [4, 1/2] -> eval ("4 + 1/2") -> 4,5
                // Ex. 4 xícaras, arrCount é [4]
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };
            } else if (parseInt(arrIng[0], 10)) {
                // Não há unidade, mas o primeiro elemento é o número
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                };
            } else if (unitIndex === -1) {
                // Não há unidade e número na 1ª posição
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // Porções
        const newServings = type === 'dec' ? this.servImgs - 1 : this.servImgs + 1;

        // Ingriedentes
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servImgs);
        })

        this.servImgs = newServings;
    }
}
