import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.itens = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.itens.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.itens.findIndex(el => el.id === id);
        // [2,4,8] emenda (1, 2) -> retorna [4, 8], a matriz original é [2]
        // [2,4,8] fatia (1, 2) -> retorna 4, a matriz original é [2,4,8]
        this.itens.splice(index, 1);
    }

    updateCount(id, newCount) {
        this.itens.find(el => el.id === id).count = newCount;
    }
}
