// Carrito en localStorage como objeto { [idProducto]: cantidad }
function getCarrito() {
  return JSON.parse(localStorage.getItem('carrito')) || {};
}
function setCarrito(c) {
  localStorage.setItem('carrito', JSON.stringify(c));
}

// Añadir
function agregarAlCarrito(id) {
  const carrito = getCarrito();
  carrito[id] = (carrito[id] || 0) + 1;
  setCarrito(carrito);
  alert('Producto agregado al carrito');
}

// Quitar una unidad
function disminuirDelCarrito(id) {
  const carrito = getCarrito();
  if (!carrito[id]) return;
  carrito[id] -= 1;
  if (carrito[id] <= 0) delete carrito[id];
  setCarrito(carrito);
  mostrarCarrito();
}

// Eliminar completamente
function eliminarDelCarrito(id) {
  const carrito = getCarrito();
  delete carrito[id];
  setCarrito(carrito);
  mostrarCarrito();
}

// Mostrar carrito (lee productos desde Supabase para nombres/precios)
async function mostrarCarrito() {
  const lista = document.getElementById('lista-carrito');
  const totalEl = document.getElementById('total');
  if (!lista || !totalEl) return;

  const carrito = getCarrito();
  const ids = Object.keys(carrito).map(Number);
  if (ids.length === 0) {
    lista.innerHTML = '<p>Tu carrito está vacío</p>';
    totalEl.textContent = '0';
    return;
  }

  // Cargar datos de productos desde Supabase
  const { data, error } = await sb.from('productos').select('*').in('id', ids);
  if (error) { lista.textContent = error.message; return; }

  let total = 0;
  lista.innerHTML = data.map(p => {
    const qty = carrito[p.id] || 0;
    const subtotal = Number(p.precio) * qty;
    total += subtotal;
    return `
      <div class="producto" style="display:grid;grid-template-columns:80px 1fr auto;gap:10px;align-items:center;">
        <img src="${p.imagen || 'img/producto1.jpg'}" alt="${p.nombre}" style="width:80px;height:60px;object-fit:cover;border-radius:6px;">
        <div style="text-align:left;">
          <strong>${p.nombre}</strong><br>
          $${Number(p.precio).toLocaleString()} x ${qty} = $${subtotal.toLocaleString()}
        </div>
        <div style="display:flex;gap:6px;">
          <button onclick="disminuirDelCarrito(${p.id})">−</button>
          <button onclick="agregarAlCarrito(${p.id})">+</button>
          <button onclick="eliminarDelCarrito(${p.id})">Eliminar</button>
        </div>
      </div>
    `;
  }).join('');

  totalEl.textContent = total.toLocaleString();
}

async function hacerPedido() {
  const lista = document.getElementById("lista-carrito").innerText;
  const total = document.getElementById("total").innerText;

  const cuerpo = `
    Pedido realizado desde la página web:
    
    Productos:
    ${lista}

    Total: $${total}
  `;

  // Enviar usando EmailJS (más sencillo desde frontend)
  emailjs.send("service_6nmyz5b", "template_xb13pnn", {
    message: cuerpo,
    from_name: "Panadería Web",
    to_email: "fernandamonsalvebakery4@gmail.com"
  }).then(() => {
    alert("Pedido enviado correctamente ✅");
  }, (err) => {
    alert("Error al enviar pedido: " + JSON.stringify(err));
  });
}


// Auto-inicializa en páginas que tengan el contenedor
document.addEventListener('DOMContentLoaded', mostrarCarrito);
