// js/admin.js
const authBox = document.getElementById('auth-box');
const adminArea = document.getElementById('admin-area');
const authMsg = document.getElementById('auth-msg');
const adminMsg = document.getElementById('admin-msg');
const loginForm = document.getElementById('login-form');
const addForm = document.getElementById('add-form');
const adminLista = document.getElementById('admin-lista');

async function checkSession() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    authBox.style.display = 'none';
    adminArea.style.display = 'block';
    cargarProductosAdmin();
  } else {
    authBox.style.display = 'block';
    adminArea.style.display = 'none';
  }
}

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  authMsg.textContent = 'Ingresando...';
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  authMsg.textContent = error ? `Error: ${error.message}` : '';
  checkSession();
});

document.getElementById('logout')?.addEventListener('click', async () => {
  await sb.auth.signOut();
  checkSession();
});

addForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('p-nombre').value.trim();
  const precio = parseFloat(document.getElementById('p-precio').value);
  const imagen = document.getElementById('p-imagen').value.trim() || null;
  const activo = document.getElementById('p-activo').checked;

  const { error } = await sb.from('productos').insert([{ nombre, precio, imagen, activo }]);
  adminMsg.textContent = error ? `Error: ${error.message}` : '✅ Producto añadido';
  addForm.reset();
  document.getElementById('p-activo').checked = true;
  cargarProductosAdmin();
});

async function cargarProductosAdmin() {
  adminLista.innerHTML = 'Cargando...';
  const { data, error } = await sb.from('productos').select('*').order('id', { ascending: true });
  if (error) { adminLista.textContent = error.message; return; }
  adminLista.innerHTML = data.map(p => `
    <div class="producto">
      <img src="${p.imagen || 'img/producto1.jpg'}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>$${Number(p.precio).toLocaleString()}</p>
      <label style="display:block;margin:6px 0;">Activo: ${p.activo ? 'Sí' : 'No'}</label>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
        <button onclick="toggleActivo(${p.id}, ${p.activo ? 'false':'true'})">${p.activo ? 'Desactivar' : 'Activar'}</button>
        <button onclick="borrarProducto(${p.id})">Eliminar</button>
      </div>
    </div>
  `).join('');
}

window.toggleActivo = async (id, nuevo) => {
  const { error } = await sb.from('productos').update({ activo: nuevo }).eq('id', id);
  adminMsg.textContent = error ? `Error: ${error.message}` : 'Estado actualizado';
  cargarProductosAdmin();
};

window.borrarProducto = async (id) => {
  if (!confirm('¿Eliminar producto?')) return;
  const { error } = await sb.from('productos').delete().eq('id', id);
  adminMsg.textContent = error ? `Error: ${error.message}` : 'Producto eliminado';
  cargarProductosAdmin();
};

checkSession();


// === GESTIÓN DE GALERÍA ===
const addFotoForm = document.getElementById("add-foto");
const listaFotos = document.getElementById("lista-fotos");

if (addFotoForm) {
  addFotoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = document.getElementById("foto-url").value;
    const desc = document.getElementById("foto-desc").value;

    const { error } = await sb.from("galeria").insert([{ url, descripcion: desc }]);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    addFotoForm.reset();
    cargarFotos();
  });
}

async function cargarFotos() {
  const { data, error } = await sb.from("galeria").select("*").order("id", { ascending: true });
  if (error) {
    listaFotos.textContent = error.message;
    return;
  }
  listaFotos.innerHTML = data.map(f => `
    <div class="foto">
      <img src="${f.url}" alt="${f.descripcion || ''}" style="width:150px;height:100px;object-fit:cover;">
      <p>${f.descripcion || ''}</p>
      <button onclick="eliminarFoto(${f.id})">Eliminar</button>
    </div>
  `).join('');
}

async function eliminarFoto(id) {
  const { error } = await sb.from("galeria").delete().eq("id", id);
  if (error) {
    alert("Error: " + error.message);
    return;
  }
  cargarFotos();
}

cargarFotos();
