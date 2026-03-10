const API_URL = 'http://localhost:3000/api';

async function loadAdminCatalog() {
    const res = await fetch(`${API_URL}/products`);
    const products = await res.json();
    const catalog = document.getElementById('admin-catalog');
    catalog.innerHTML = '';

    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <h4>${p.name}</h4>
            <p>Stock attuale: ${p.stock}</p>
            <input type="number" id="stock-${p.id}" value="${p.stock}">
            <button onclick="updateStock(${p.id})">Aggiorna Stock</button>
        `;
        catalog.appendChild(div);
    });
}

async function addProduct() {
    const name = document.getElementById('new-name').value;
    const price = parseInt(document.getElementById('new-price').value);
    const stock = parseInt(document.getElementById('new-stock').value);

    await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, stock })
    });
    loadAdminCatalog();
}

async function updateStock(id) {
    const stock = parseInt(document.getElementById(`stock-${id}`).value);
    await fetch(`${API_URL}/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock })
    });
    loadAdminCatalog();
}

async function giveBonus() {
    const amount = parseInt(document.getElementById('bonus-amount').value);
    await fetch(`${API_URL}/admin/users/1/credits`, { // Hardcoded Utente 1 per simulazione
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
    });
    alert("Crediti assegnati con successo!");
}

loadAdminCatalog();