// SOSTITUISCI QUESTA URL con quella che ti dà Render (es. https://ecommerce-backend.onrender.com/api)
const API_URL = 'http://localhost:3000/api'; 

// Funzione per caricare i prodotti (quella che ti dava errore nello screenshot)
async function loadAdminCatalog() {
    try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) throw new Error("Errore nel caricamento");
        const products = await res.json();
        const catalog = document.getElementById('admin-catalog');
        catalog.innerHTML = '';

        products.forEach(p => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
                <h4>${p.name}</h4>
                <p>Stock: <input type="number" id="stock-${p.id}" value="${p.stock}" style="width:60px"></p>
                <button onclick="updateStock(${p.id})">Aggiorna Stock</button>
            `;
            catalog.appendChild(div);
        });
    } catch (err) {
        console.error("Non riesco a connettermi al backend:", err);
        document.getElementById('admin-catalog').innerHTML = "<p style='color:red'>Errore: Server non raggiungibile</p>";
    }
}

// Aggiungi Prodotto
async function addProduct() {
    const name = document.getElementById('new-name').value;
    const price = Number(document.getElementById('new-price').value);
    const stock = Number(document.getElementById('new-stock').value);

    await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, stock })
    });
    loadAdminCatalog();
}

// Assegna Bonus
async function giveBonus() {
    const amount = Number(document.getElementById('bonus-amount').value);
    await fetch(`${API_URL}/admin/users/1/credits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
    });
    alert("Crediti inviati!");
}

// Carica tutto all'avvio
loadAdminCatalog();