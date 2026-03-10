const API = "http://localhost:3000/api"
const userId = 1

let cachedProducts = []

function logAdmin(msg, level = 'info'){
	const el = document.getElementById('adminLog')
	if(!el) return
	const time = new Date().toLocaleTimeString()
	const entry = document.createElement('div')
	entry.textContent = `[${time}] ${msg}`
	el.prepend(entry)
}

async function fetchJson(url, opts){
	try{
		const res = await fetch(url, opts)
		if(!res.ok) throw new Error(`${res.status} ${res.statusText}`)
		return await res.json()
	}catch(e){
		console.error('API error', e)
		logAdmin(`Errore API: ${e.message}`)
		return null
	}
}

async function loadUser(){
	const data = await fetchJson(`${API}/user/${userId}`)
	if(!data) return
	const c = document.getElementById('credits')
	if(c) c.innerText = data.credits
}

async function loadProducts(){
	const products = await fetchJson(`${API}/products`)
	if(!products) return
	cachedProducts = products
	renderProducts()
}

function getSearchTerm(){
	const s = document.getElementById('search')
	return s ? s.value.trim().toLowerCase() : ''
}

function getSortMode(){
	const s = document.getElementById('sort')
	return s ? s.value : ''
}

function renderProducts(){
	const container = document.getElementById('products')
	if(!container) return

	const q = getSearchTerm()
	const sort = getSortMode()

	let list = cachedProducts.slice()
	if(q) list = list.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)))

	if(sort === 'price-asc') list.sort((a,b)=>a.price-b.price)
	if(sort === 'price-desc') list.sort((a,b)=>b.price-a.price)
	if(sort === 'stock-desc') list.sort((a,b)=>b.stock-b.stock)

	container.innerHTML = ''
	if(list.length === 0){
		container.innerHTML = '<div class="card">Nessun prodotto trovato</div>'
		return
	}

	list.forEach(p => {
		const card = document.createElement('article')
		card.className = 'product card'
		const html = `
			<div>
				<h3>${escapeHtml(p.name)}</h3>
				<div class="meta">Prezzo: €${Number(p.price).toFixed(2)} • Stock: ${p.stock}</div>
				<p class="desc">${p.description || ''}</p>
			</div>
			<div class="actions">
				<button class="btn primary" ${p.stock<=0? 'disabled' : ''} onclick="buy(${p.id})">Compra</button>
				<span class="pill ${p.stock>0? 'in-stock' : 'out-of-stock'}">${p.stock>0? 'Disponibile' : 'Esaurito'}</span>
			</div>
		`
		card.innerHTML = html
		container.appendChild(card)
	})
}

function escapeHtml(s){
	if(!s) return ''
	return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
}

async function buy(productId){
	const res = await fetchJson(`${API}/buy`,{
		method:'POST',
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify({userId, productId})
	})
	if(res){
		logAdmin(`Utente ${userId} ha comprato prodotto ${productId}`)
		await loadUser()
		await loadProducts()
	}
}

async function addProduct(){
	const name = document.getElementById('name').value
	const price = Number(document.getElementById('price').value)
	const stock = Number(document.getElementById('stock').value)
	if(!name) return logAdmin('Nome prodotto mancante')

	const res = await fetchJson(`${API}/admin/addProduct`,{
		method:'POST',
		headers:{'Content-Type':'application/json'},
		body: JSON.stringify({name,price,stock})
	})
	if(res) {
		logAdmin(`Aggiunto prodotto: ${name}`)
		document.getElementById('addProductForm').reset()
		await loadProducts()
	}
}

async function addCredits(){
	const uid = Number(document.getElementById('userId').value)
	const credits = Number(document.getElementById('credits').value)
	if(!uid) return logAdmin('User ID mancante')

	const res = await fetchJson(`${API}/admin/addCredits`,{
		method:'POST',
		headers:{'Content-Type':'application/json'},
		body: JSON.stringify({userId:uid,credits})
	})
	if(res){
		logAdmin(`Assegnati ${credits} crediti a utente ${uid}`)
		document.getElementById('addCreditsForm').reset()
	}
}

if(document.getElementById('products')){
	loadUser()
	loadProducts()
}