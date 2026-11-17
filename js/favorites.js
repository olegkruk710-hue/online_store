import { updateData, getData } from "./api.js";

let favorites = [];

export async function getFavorites() {
    try {
    const data = await getData("carts/1");
    favorites = data.favorites;
    return favorites;
    } catch(error) {
        console.log(error.message);
    }
    
}

export async function saveFavorite(cart) {
    const data = {
        "favorites": cart
    };
    try {
    await updateData("carts", 1, data);
    } catch(error) {
        console.log(error.message);
    }
}

export async function addToFavorite(product) {
    const existProduct = favorites.find(function (p) {
        return product.title === p.title;
    });
    if (existProduct) {
        return
    } else {
        favorites.push(product);
    }
    try {
    await saveFavorite(favorites);
    } catch(error) {
        console.log(error.message);
    }
}

export function renderFavorites(cart) {
    const containerForFavorites = document.querySelector("#containerForFavorites")
    containerForFavorites.innerHTML = "";

    if (cart.length === 0) {
        containerForFavorites.innerHTML = "<p>Пусто...</p>";
        return;
    }

    cart.forEach(function (item) {
        const element = document.createElement("div");

        element.classList.add("favorite-item");

        element.innerHTML = `
            <img src=${item.picture || "media/404.png"}>
            <div class="cart-info">
                <h3>Товар: ${item.title}</h3>
                <p>Цена: ${item.price}</p>
            </div>
            <div class="cart-actions">
                <button class="delete" data-id=${item.id}>
                Удалить
                </button>
            </div>
        `;
        containerForFavorites.append(element);
    })
    }        