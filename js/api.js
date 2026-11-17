const API_MOCK = "https://6ae9f1bd3d3dd3d37be5f126.mockapi.io/api/online_store/"

async function getData(endpoint) {
    const response = await fetch(`${API_MOCK}${endpoint}`);
    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

async function createData(endpoint, data) {
    const response = await fetch(`${API_MOCK}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
    }

    const dataa = await response.json();
    return dataa;
}

async function deleteData(endpoint, id) {
    const response = await fetch(`${API_MOCK}${endpoint}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

async function updateData(endpoint, id, data) {
    const response = await fetch(`${API_MOCK}${endpoint}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
    }

    const dataa = await response.json();
    return dataa;
}

export {getData, createData, updateData, deleteData}
