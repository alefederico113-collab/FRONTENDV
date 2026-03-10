// IMPORTANTE: Cambia questa URL con quella di Render o Glitch in fase di deploy!
const API_URL = 'http://localhost:3000/api'; 
const USER_ID = 1; // Simulazione utente loggato

async function loadUser() {
    const res = await fetch(`${API_URL}/users/${USER_ID}`);
    const user = await res.json();
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-credits').textContent = user.credits;
}

async function loadCatalog() {
    const res = await fetch(`${API_URL}/products`);
    const products = await res.json();
    const catalog = document.getElementById('catalog');
    catalog.innerHTML = '';

    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <h4>${p.name}</h4>
            <p>Prezzo: ${p.price} crediti</p>
            <p>Disponibili: ${p.stock}</p>
            <button onclick="buyProduct(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>
                ${p.stock === 0 ? 'Esaurito' : 'Acquista'}
            </button>
        `;
        catalog.appendChild(div);
    });
}

async function buyProduct(productId) {
    const res = await fetch(`${API_URL}/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID, productId })
    });
    
    const data = await res.json();
    if (!res.ok) {
        alert("Errore: " + data.error);
    } else {
        alert("Acquisto riuscito!");
        loadUser();
        loadCatalog();
    }
}

// Inizializzazione
loadUser();
loadCatalog();