const API="http://localhost:3000/api"
const userId=1

async function loadUser(){

const res=await fetch(`${API}/user/${userId}`)
const data=await res.json()

document.getElementById("credits").innerText=data.credits

}

async function loadProducts(){

const res=await fetch(`${API}/products`)
const products=await res.json()

const div=document.getElementById("products")

div.innerHTML=""

products.forEach(p=>{

div.innerHTML+=`
<div>
<h3>${p.name}</h3>
<p>Prezzo: ${p.price}</p>
<p>Stock: ${p.stock}</p>
<button onclick="buy(${p.id})">Compra</button>
</div>
`

})

}

async function buy(productId){

await fetch(`${API}/buy`,{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
userId,
productId
})
})

loadUser()
loadProducts()

}

async function addProduct(){

const name=document.getElementById("name").value
const price=document.getElementById("price").value
const stock=document.getElementById("stock").value

await fetch(`${API}/admin/addProduct`,{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify({name,price,stock})
})

}

async function addCredits(){

const userId=document.getElementById("userId").value
const credits=document.getElementById("credits").value

await fetch(`${API}/admin/addCredits`,{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify({userId,credits})
})

}

if(document.getElementById("products")){

loadUser()
loadProducts()

}