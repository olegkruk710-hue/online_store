import { getData, updateData } from "./api.js"
import { getProducts } from "./products.js";

let cart = []

export async function getCart() {
    const data = await getData("carts/1");
    cart = data.carts;
}
getCart();

export async function saveCart(cart) {
    const data = {
        "carts": cart
    };
    await updateData("carts", 1, data);
}

export async function addToCart(product) {
    const existProduct = cart.find(function (p) {
        return product.title === p.title;
    });
    if (existProduct) {
        existProduct.count += 1;
    } else {
        cart.push(product);
    }
    await saveCart(cart);
}

export function getCartCount() {
    let total = 0
    cart.forEach(function(item) {
        total += item.count;
    });
    return total;
}


export async function updateProductQuantity(product_id, change) {
    const products = await getProducts();
    
    const product = products.find(function(product) {
        return product.id === product_id;
    });
    if (!product) {
        console.log("Товар не найден!")
        return;
    }
    product.quantity += change;
    
    await updateData("products", product.id, product);
}
