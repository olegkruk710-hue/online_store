import { getData, createData, updateData } from "./api.js"
import { addToCart, getCartCount } from "./cart.js";
import { renderProducts, filter, saveProduct, showProductDetail } from './products.js'
import { uploadImage } from "./addProduct.js";
import { addToFavorite, getFavorites, renderFavorites, saveFavorite } from "./favorites.js";

let products = [];

const productsInPage = document.querySelector("#products")

const message = document.querySelector("#message");
const categorySelect = document.querySelector("#categorySelect");
const searchInput = document.querySelector("#searchInput");
const productContainer = document.querySelector("#products");
const cartCount = document.querySelector("#cartCount");

const productModal = document.querySelector("#productModal");

const createProductModal = document.querySelector("#createProductModal");

const form = document.querySelector("#productForm");
const formsMessage = document.querySelector("#formsMessage");
const addProductBtn = document.querySelector("#addProductBtn");

const favoriteProducts = document.querySelector("#favoriteProducts");
const showFavoritesProductsModal = document.querySelector("#showFavoritesProductsModal");
const containerForFavorites = document.querySelector("#containerForFavorites");


const CreateProductDetailBtn = document.querySelector("#CreateProductDetailBtn");

async function start() {
    message.textContent = "Загрузка товаров...";
    products = await getData("products");
    message.textContent = "";
    renderProducts(products);
    renderCategories();
    updateCartCount()
}
start();


function renderCategories() {
    const categories = [];

    products.forEach(function(product) {
        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }
    });
    categories.forEach(function(category) {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.append(option);
    });
}

function updateCartCount() {
    console.log(getCartCount())
    cartCount.textContent = getCartCount();
}

categorySelect.addEventListener("change", function() {
    filter(products);
});
searchInput.addEventListener("input", function() {
    filter(products);
});

productContainer.addEventListener("click", async function(event) {
    if (event.target.tagName !== "BUTTON") return;
    const button = event.target
    const id = button.dataset.id;
    const product = products.find(function(p) {
        return p.id === id;
    });

    if (button.classList.contains("add-cart")) {
        await workWIthCard(product);
    }
    else if (button.classList.contains("product-detail")) {
        if (product) {
            showProductDetail(product);
        }
    } else if (button.classList.contains("add-toFavorite")) {
        if(product) {
            await addToFavorite(product);    
        }
    }
});

productModal.addEventListener("click", async function(event) {
    if (event.target.tagName !== "BUTTON") return;
    const button = event.target;
    const id = button.dataset.id;
    let product;
    if (id) {
        product = products.find(item => item.id === id);
    }

    if (button.id === "closeProduct") {
        productModal.classList.add("hidden");

    } else if (button.className === "add-cart") {
        await workWIthCard(product);
    }
});



CreateProductDetailBtn.addEventListener("click", ()=>{
    createProductModal.classList.remove("hidden");
});

createProductModal.addEventListener("click", event=>{
    if (event.target.id === "closeCreateProductModal") {
        createProductModal.classList.add("hidden");
    } 

});  


form.addEventListener("submit", async function(event) {
    event.preventDefault();

    if (addProductBtn.disabled) return;

    addProductBtn.disabled = true;

    const fields = new FormData(form);
    console.log(fields);
    fields.forEach(item => {
        console.log(item);
    });

    const file = fields.get("image");

    try {
        formsMessage.textContent = "Загрузка изображения в IMGBB.."
        const image = await uploadImage(file);

        formsMessage.textContent = "Добавление продукта в базу данных (MockAPI)...";
        const data = await createData("products", {
            title: fields.get("title").trim(),
            description: fields.get("description").trim(),
            category: fields.get("category").trim(),
            price: fields.get("price"),
            quantity: fields.get("quantity"),
            picture: image
        });
        form.reset();
        formsMessage.textContent = "Продукт успешно добавлен!";                                                           
        createProductModal.classList.add("hidden");
        products.push(data);
        renderProducts(products);

    } catch(error) {
        formsMessage.textContent = "Не удалось добавить продукт, ошибка: " + error.message
    } finally {
        addProductBtn.disabled = false;
        return;
    }
    
});

favoriteProducts.addEventListener("click", async function(event){
    showFavoritesProductsModal.classList.remove("hidden");
    productsInPage.style = "position: fixed;";
    let favorites = await getFavorites();
    renderFavorites(favorites);
});

showFavoritesProductsModal.addEventListener("click", event=>{
    if (event.target.id === "closeFavoritesProductsModalBtn") {
        productsInPage.style = "position: relative;";
        showFavoritesProductsModal.classList.add("hidden");
    }
});

containerForFavorites.addEventListener("click", async function(event) {
    let favorites;
    if (event.target.className === "delete") {
        favorites = await getFavorites();
        favorites = favorites.filter(prodouct => prodouct.id !== event.target.dataset.id);
        await saveFavorite(favorites);
        renderFavorites(favorites);
    }
})

async function workWIthCard(product) {
    if (product && product.quantity > 0) {
            product.quantity -= 1;
            const data = {
                id: product.id,
                title: product.title,
                description: product.description,
                quantity: product.quantity,
                price: product.price,
                count: 1,
                picture: product.picture || "./media/404.png"
            };
            await addToCart(data);
            await saveProduct(product);

            updateCartCount();
            if (!product.quantity) {
                filter(products);
            }
        }
}