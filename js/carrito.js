async function cargarProductos() {
  const resp = await fetch("data/productos.json");
  const productos = await resp.json();
  let html = "";
  productos.forEach(p => {
    html += `
      <div class="producto">
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p>$${p.precio}</p>
        <button onclick="agregarAlCarrito(${p.id})">Agregar</button>
      </div>
    `;
  });
  const contenedor = document.getElementById("productos");
  if (contenedor) contenedor.innerHTML = html;
}

function agregarAlCarrito(id) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push(id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert("Producto agregado al carrito");
}

async function mostrarCarrito() {
  const resp = await fetch("data/productos.json");
  const productos = await resp.json();
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let html = "";
  let total = 0;

  carrito.forEach(id => {
    let prod = productos.find(p => p.id === id);
    if (prod) {
      html += `<p>${prod.nombre} - $${prod.precio}</p>`;
      total += prod.precio;
    }
  });

  const lista = document.getElementById("lista-carrito");
  if (lista) lista.innerHTML = html;
  const t = document.getElementById("total");
  if (t) t.innerText = total;
}

cargarProductos();
mostrarCarrito();
