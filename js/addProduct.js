const API_IMGBB = "https://api.imgbb.com/1/upload";
const API_key = "d45cc626fbbde10e1f7b2ba0b8eadcad";

export async function uploadImage(file) {
    const body = new FormData();

    body.append("image", file);
    const endpoint = API_IMGBB + "?key=" + API_key;

    const response = await fetch(endpoint, {
        method: "POST", 
        body
    });
    if (!response.ok) {
        throw new Error("Ошибка загрузки изображения" + response.status);
    }
    const data = await response.json();

    if (!data.success) {
        throw new Error("Ошибка загрузки изображения" + data.status);
    }

    return data.data.url;
}
